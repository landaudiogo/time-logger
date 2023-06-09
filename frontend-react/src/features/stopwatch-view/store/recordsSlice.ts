import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

import { RootState, AppDispatch } from "store";
import { uuid } from "lib";
import { addTag } from "features/tag";

import { selectStopwatch, stopwatchInitialized } from "../store/stopwatchSlice";
import { Stopwatch } from "../types/stopwatch";
import { LapRecord, Records } from "../types/records";
import { loadRecordsFromLocalStorage, recordsStorageToState } from "../lib/storage";


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

const storageObject = loadRecordsFromLocalStorage(new Date());
console.log(storageObject);
const initialState = recordsStorageToState(storageObject);

const recordsSlice = createSlice({
    name: "records",
    initialState,
    reducers: {
        recordAdded: {
            reducer(records, action: PayloadAction<RecordType>) {
                const payload = action.payload;
                records[payload.id] = action.payload;
            },
            prepare: (stopwatch: Stopwatch) => {
                if (!stopwatch.startTime || !stopwatch.endTime) {
                    console.log(stopwatch);
                    throw new Error("Stopwatch is not populated");
                }
                const ret = {
                    payload: {
                        startTime: stopwatch.startTime,
                        endTime: stopwatch.endTime,
                        tag: stopwatch.tag,
                        id: uuid(),
                    }
                };
                return ret;
            },
        },
        manualRecordAdded: {
            reducer(records, action: PayloadAction<RecordType>) {
                const payload = action.payload;
                records[payload.id] = action.payload;
            },
            prepare: (manualRecord: ManualRecordType) => {
                const ret = {
                    payload: {
                        ...manualRecord,
                        tag: manualRecord.tag.trim(),
                        id: uuid(),
                    }
                };
                return ret;
            }
        },
        modifyRecord(records, action: PayloadAction<RecordType>) {
            records[action.payload.id] = {
                ...action.payload,
                tag: action.payload.tag.trim(),
            };
        },
        deleteRecord(records, action: PayloadAction<DeleteRecordAction>) {
            delete records[action.payload.id];
        }
    }
});

const selectRecords = (state: RootState): Records => state.records;

function addRecord() {

    return (dispatch: AppDispatch, getState: () => RootState) => {
        const stopwatch = selectStopwatch(getState());
        dispatch(recordAdded(stopwatch));
        dispatch(stopwatchInitialized({}));
        dispatch(addTag(stopwatch.tag));
    }
}

export function modifyRecord(record: RecordType) {

    return (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(addTag(record.tag));
        dispatch(recordsSlice.actions.modifyRecord(record));
    }
}

export { selectRecords };
export default recordsSlice.reducer;
export const {
    recordAdded, manualRecordAdded, deleteRecord
} = recordsSlice.actions;
export { addRecord }; 
