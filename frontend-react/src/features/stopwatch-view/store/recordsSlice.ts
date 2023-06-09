import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

import { RootState, AppDispatch } from "store";
import { uuid } from "lib";
import { addTag } from "features/tag";
import { selectStopwatch, stopwatchInitialized } from "../store/stopwatchSlice";
import { LapRecord, Stopwatch } from "../types";


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

const initialState: RecordsType = {
    records: {}
}

const recordsSlice = createSlice({
    name: "records",
    initialState,
    reducers: {
        recordAdded: {
            reducer(state, action: PayloadAction<RecordType>) {
                const payload = action.payload;
                state.records[payload.id] = action.payload;
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
            reducer(state, action: PayloadAction<RecordType>) {
                const payload = action.payload;
                state.records[payload.id] = action.payload;
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
        modifyRecord(state, action: PayloadAction<RecordType>) {
            state.records[action.payload.id] = {
                ...action.payload,
                tag: action.payload.tag.trim(),
            };
        },
        deleteRecord(state, action: PayloadAction<DeleteRecordAction>) {
            delete state.records[action.payload.id];
        }
    }
});

const selectRecords = (state: RootState): RecordsType => state.records;

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
