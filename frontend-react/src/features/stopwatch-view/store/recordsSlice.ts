import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

import { RootState, AppDispatch } from "store";
import { uuid } from "lib";
import { addTag } from "features/tag";

import { selectStopwatch, stopwatchInitialized } from "../store/stopwatchSlice";
import { Stopwatch } from "../types/stopwatch";
import { LapRecord, Records } from "../types/records";
import { 
    loadRecordsFromLocalStorage, recordsStorageToState, 
    recordsToLocalStorage,
} from "../lib/storage";


type RecordsType = {
    records: {
        [key: string]: LapRecord
    }
}

type RecordType = {
    id: string,
    startTime: number,
    endTime: number,
    tag: string,
}

type ManualRecordType = {
    startTime: number,
    endTime: number,
    tag: string
}

type DeleteRecordAction = {
    id: string,
}
type RecordsAddedAction = {
    records: Records
}

const storageObject = loadRecordsFromLocalStorage(new Date());
const initialState = recordsStorageToState(storageObject);

const recordsSlice = createSlice({
    name: "records",
    initialState,
    reducers: {
        recordAdded(records, action: PayloadAction<RecordType>) { 
            const payload = action.payload;
            records[payload.id] = action.payload;
        },
        manualRecordAdded(records, action: PayloadAction<RecordType>) {
            const payload = action.payload;
            records[payload.id] = action.payload;
        },
        modifyRecord(records, action: PayloadAction<RecordType>) {
            records[action.payload.id] = {
                ...action.payload,
                tag: action.payload.tag.trim(),
            };
        },
        deleteRecord(records, action: PayloadAction<DeleteRecordAction>) {
            delete records[action.payload.id];
        },
        recordsAdded(records, action: PayloadAction<RecordsAddedAction>) {
            for (const record of Object.values(action.payload.records)) {
                records[record.id] = record;
            }
        }
    }
});

const recordsReducer = recordsSlice.reducer;
const recordsRootReducer: typeof recordsReducer = (state, action) => {
    if (action.type === "concurrent/records") {
        console.log(action.type);
        return recordsReducer(action.payload, action);
    }
    return recordsReducer(state, action);
}

const selectRecords = (state: RootState): Records => state.records;

export function addRecord() {

    return (dispatch: AppDispatch, getState: () => RootState) => {
        const stopwatch = selectStopwatch(getState());
        if (stopwatch.endTime === null || stopwatch.startTime === null) {
            console.log(stopwatch);
            throw Error("Cannot add record: start or end time for stopwatch is null");
        }
        const record =  {
            startTime: stopwatch.startTime,
            endTime: stopwatch.endTime,
            tag: stopwatch.tag,
            id: uuid(),
        }
        dispatch(recordsSlice.actions.recordAdded(record));
        dispatch(stopwatchInitialized({}));
        dispatch(addTag(stopwatch.tag));

        const storageDate = new Date(record.startTime);
        const recordsStorage = loadRecordsFromLocalStorage(storageDate);
        const records = recordsStorageToState(recordsStorage);
        records[record.id] = record;
        recordsToLocalStorage(records, storageDate);
    }
}

export function modifyRecord(record: RecordType) {

    return (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(addTag(record.tag));
        dispatch(recordsSlice.actions.modifyRecord(record));

        const storageDate = new Date(record.startTime);
        const recordsStorage = loadRecordsFromLocalStorage(storageDate);
        const records = recordsStorageToState(recordsStorage);
        records[record.id] = record;
        recordsToLocalStorage(records, storageDate);
    }
}

export function manualRecordAdded(manualRecord: ManualRecordType) { 

    return (dispatch: AppDispatch, getState: () => RootState) => {
        const record = {
            ...manualRecord,
            tag: manualRecord.tag.trim(),
            id: uuid(),
        }
        dispatch(recordsSlice.actions.manualRecordAdded(record))

        const storageDate = new Date(manualRecord.startTime);
        const recordsStorage = loadRecordsFromLocalStorage(storageDate);
        const records = recordsStorageToState(recordsStorage);
        records[record.id] = record;
        recordsToLocalStorage(records, storageDate);
    }
    
}

export function deleteRecord(id: string) { 

    return (dispatch: AppDispatch, getState: () => RootState) => {
        const record = selectRecords(getState())[id];
        dispatch(recordsSlice.actions.deleteRecord(record));

        const storageDate = new Date(record.startTime);
        const recordsStorage = loadRecordsFromLocalStorage(storageDate);
        const records = recordsStorageToState(recordsStorage);
        delete records[record.id];
        recordsToLocalStorage(records, storageDate);
    }
    
}

export { selectRecords };
export const { recordsAdded } = recordsSlice.actions;
export default recordsRootReducer;
