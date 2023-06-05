import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { selectStopwatch, stopwatchInitialized } from "../store/stopwatchSlice";
import { LapRecord, StopwatchType } from "../types";
import { uuid } from "lib";


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
            prepare: (stopwatch: StopwatchType) => {
                if (!stopwatch.startTime || !stopwatch.endTime)
                    throw new Error("Stopwatch is not populated");
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
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stopwatch = selectStopwatch(getState());
        dispatch(recordAdded(stopwatch));
        dispatch(stopwatchInitialized({}));
    }
}

export { selectRecords };
export default recordsSlice.reducer;
export const { 
    recordAdded, manualRecordAdded, modifyRecord, deleteRecord
} = recordsSlice.actions;
export { addRecord }; 
