import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { stopwatchReducer, recordsReducer } from "features/stopwatch-view";
import { useDispatch } from "react-redux";

import { printDateComponent } from "features/stopwatch-view";
import { 
    timerReducer, loadTimerFromLocalStorage, timerStorageToState
} from "features/timer-view";
import { 
    tagsReducer, loadTagsFromLocalStorage, tagsStorageToState
} from "features/tag";
import { 
    loadStopwatchFromLocalStorage, stopwatchStorageToState,
    loadRecordsFromLocalStorage, recordsStorageToState
} from "./features/stopwatch-view";


const appReducer = combineReducers({
    stopwatch: stopwatchReducer,
    records: recordsReducer,
    timer: timerReducer,
    tags: tagsReducer,
})

const store = configureStore({
    reducer: appReducer,
})

window.addEventListener("storage", (e: StorageEvent) => {
    const today = new Date();
    const todaysDateComponent = printDateComponent(today.getTime());
    if (e.key === "tags") {
        const tagsStorage = loadTagsFromLocalStorage();
        const tagsState = tagsStorageToState(tagsStorage);
        store.dispatch({ "type": "concurrent/tags", "payload": tagsState });
    } else if (e.key === "stopwatch") {
        const stopwatchStorage = loadStopwatchFromLocalStorage();
        const stopwatchState = stopwatchStorageToState(stopwatchStorage);
        store.dispatch({ "type": "concurrent/stopwatch", "payload": stopwatchState});
    } else if (e.key === "timer") {
        const timerStorage = loadTimerFromLocalStorage();
        const timerState = timerStorageToState(timerStorage);
        store.dispatch({ "type": "concurrent/timer", "payload": timerState});
    } else if (e.key === todaysDateComponent) {
        const recordsStorage = loadRecordsFromLocalStorage(today);
        const recordsState = recordsStorageToState(recordsStorage);
        store.dispatch({ "type": "concurrent/records", "payload": recordsState});
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export { store };
