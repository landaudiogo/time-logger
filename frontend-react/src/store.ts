import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { stopwatchReducer, recordsReducer } from "features/stopwatch-view";
import { useDispatch } from "react-redux";

import { getPersistedDays } from "lib/localstorage";

import { printDateComponent } from "features/stopwatch-view";
import { timerReducer } from "features/timer-view";
import { 
    tagsReducer, loadTagsFromLocalStorage, tagsStorageToState
} from "features/tag";
import { loadStopwatchFromLocalStorage, stopwatchStorageToState } from "./features/stopwatch-view/lib/storage";


const todaysDate: string = printDateComponent(new Date().getTime());


const storedDates = getPersistedDays().map(key => new Date(key));
storedDates.sort((a, b) => ((a < b) ? 1 : -1));


const appReducer = combineReducers({
    stopwatch: stopwatchReducer,
    records: recordsReducer,
    timer: timerReducer,
    tags: tagsReducer,
})

const rootReducer: typeof appReducer = (state, action): RootState => {
    if (action.type === "CONCURRENT_UPDATE") {
        if (JSON.stringify(state) !== JSON.stringify(action.payload)) {
            console.log(action.type);
            return appReducer(action.payload, action)
        }
        return appReducer(state, action);
    }
    return appReducer(state, action);
}

const store = configureStore({
    reducer: rootReducer,
})

window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === "tags") {
        const tagsStorage = loadTagsFromLocalStorage();
        const tagsState = tagsStorageToState(tagsStorage);
        store.dispatch({ "type": "concurrent/tags", "payload": tagsState });
    } else if (e.key === "stopwatch") {
        const stopwatchStorage = loadStopwatchFromLocalStorage();
        const stopwatchState = stopwatchStorageToState(stopwatchStorage);
        store.dispatch({ "type": "concurrent/stopwatch", "payload": stopwatchState});
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export { store };
