import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { StopwatchState, StopwatchType } from "../types";

const initialState: StopwatchType = {
    state: StopwatchState.Initialized,
    startTime: null,
    endTime: null,
    tag: "",
}

type TagAddedType = {
    tag: string
}

const stopwatchSlice = createSlice({
    name: "stopwatch",
    initialState,
    reducers: {
        stopwatchInitialized(stopwatch, action) {
            stopwatch.state = StopwatchState.Initialized;
            stopwatch.startTime = null;
            stopwatch.endTime = null;
        },
        stopwatchStarted(stopwatch, action) {
            stopwatch.state = StopwatchState.Started;
            stopwatch.startTime = Date.now();
            stopwatch.endTime = null;
        },
        stopwatchStopped(stopwatch, action) {
            stopwatch.state = StopwatchState.Stopped;
            stopwatch.endTime = Date.now();

        },
        tagAdded(stopwatch, action: PayloadAction<TagAddedType>) {
            stopwatch.tag = action.payload.tag.trim();
        }

    }
});

const selectStopwatch = (state: RootState): StopwatchType => state.stopwatch;

export { selectStopwatch };
export const { 
    stopwatchInitialized, stopwatchStarted, stopwatchStopped, 
    tagAdded 
} = stopwatchSlice.actions;
export default stopwatchSlice.reducer;
