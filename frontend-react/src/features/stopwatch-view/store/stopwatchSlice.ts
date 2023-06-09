import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "store";
import { 
    loadStopwatchFromLocalStorage, stopwatchToLocalStorage, 
    stopwatchStorageToState,
} from "../lib/storage";
import { StopwatchState, Stopwatch } from "../types/stopwatch";


const storageObject = loadStopwatchFromLocalStorage();
let initialState = stopwatchStorageToState(storageObject);


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
            stopwatch.tag = action.payload.tag;
        }

    }
});

const stopwatchReducer = stopwatchSlice.reducer;
const stopwatchRootReducer: typeof stopwatchReducer = (state, action) => {
    if (action.type === "concurrent/stopwatch") {
        console.log(action.type);
        return stopwatchReducer(action.payload, action);
    }
    return stopwatchReducer(state, action);
}

const selectStopwatch = (state: RootState): Stopwatch => state.stopwatch;

export function tagAdded(payload: TagAddedType) { 
    const actionTagAdded = stopwatchSlice.actions.tagAdded; 

    return (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(actionTagAdded(payload));
        const stopwatch = selectStopwatch(getState());
        stopwatchToLocalStorage(stopwatch);
    }
}

export function stopwatchInitialized(payload: {}) { 
    const actionStopwatchInitialized = stopwatchSlice.actions.stopwatchInitialized; 

    return (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(actionStopwatchInitialized(payload));
        const stopwatch = selectStopwatch(getState());
        stopwatchToLocalStorage(stopwatch);
    }
}

export function stopwatchStarted(payload: {}) { 
    const actionStopwatchStarted = stopwatchSlice.actions.stopwatchStarted; 

    return (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(actionStopwatchStarted(payload));
        const stopwatch = selectStopwatch(getState());
        stopwatchToLocalStorage(stopwatch);
    }
}

export function stopwatchStopped(payload: {}) { 
    const actionStopwatchStopped = stopwatchSlice.actions.stopwatchStopped; 

    return (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(actionStopwatchStopped(payload));
        const stopwatch = selectStopwatch(getState());
        stopwatchToLocalStorage(stopwatch);
    }
}

export { selectStopwatch };
export default stopwatchRootReducer;
