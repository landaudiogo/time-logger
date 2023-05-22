import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { selectStopwatch, stopwatchInitialized } from "../store/stopwatchSlice";
import { StopwatchType } from "../types";

export type LapRecord = {
    lap: number,
    tag: string,
    startTime: number,
    endTime: number
}

type RecordsType = {
    records: {
        [key: number]: LapRecord
    }
}

type RecordType = {
    lap: number,
    startTime: number,
    endTime: number,
    tag: string,
}

type ManualRecordType = { 
    startTime: number, 
    endTime: number, 
    tag: string
}

const count = { value: 0 };

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
                state.records[payload.lap] = action.payload;
            },
            prepare: (stopwatch: StopwatchType) => {
                if (!stopwatch.startTime || !stopwatch.endTime)
                    throw new Error("Stopwatch is not populated");
                const ret = {
                    payload: {
                        startTime: stopwatch.startTime,
                        endTime: stopwatch.endTime,
                        tag: stopwatch.tag,
                        lap: count.value,
                    }
                };
                count.value = count.value + 1;
                return ret;
            },
        },
        manualRecordAdded: {
            reducer(state, action: PayloadAction<RecordType>) {
                const payload = action.payload;
                state.records[payload.lap] = action.payload;
            }, 
            prepare: (manualRecord: ManualRecordType) => {
                const ret = {
                    payload: {
                        ...manualRecord,
                        lap: count.value
                    }
                };
                count.value = count.value + 1;
                return ret;
            }
        },
        modifyRecord(state, action: PayloadAction<RecordType>) {
            state.records[action.payload.lap] = action.payload;
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
export const { recordAdded, manualRecordAdded, modifyRecord } = recordsSlice.actions;
export { addRecord }; 
