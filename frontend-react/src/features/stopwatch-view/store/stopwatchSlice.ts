import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";
import { StopwatchState } from "../types";

type StopwatchType = {
    state: StopwatchState,
    startTime: number | null,
    endTime: number | null,
}

const initialState: StopwatchType = {
    state: StopwatchState.Initialized,
    startTime: null,
    endTime: null,
}

const stopwatchSlice = createSlice({
    name: "stopwatch",
    initialState,
    reducers: {
        stopwatchStarted(stopwatch, action) {
            return {
                state: StopwatchState.Started, 
                startTime: Date.now(),
                endTime: null,
            };
        },
        stopwatchStopped(stopwatch, action) {
            stopwatch.state = StopwatchState.Stopped;
            stopwatch.endTime = Date.now();
        }

    }
});

const selectStopwatch = (state: RootState) => state.stopwatch;

export const { stopwatchStarted, stopwatchStopped } = stopwatchSlice.actions;
export { selectStopwatch };
export default stopwatchSlice.reducer;
