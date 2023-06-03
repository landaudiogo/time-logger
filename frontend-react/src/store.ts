import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { stopwatchReducer, recordsReducer } from "features/stopwatch-view";
import { timerReducer } from "features/timer-view";
import { useDispatch } from "react-redux";
import { printDateComponent } from './features/stopwatch-view';
import { StopwatchType, StopwatchState } from "./features/stopwatch-view";
import { PersistedData } from "types";
import { getPersistedDays } from "lib/localstorage";


const todaysDate: string = printDateComponent(new Date().getTime());


const storedDates = getPersistedDays().map(key => new Date(key));
storedDates.sort((a, b) => ((a < b) ? 1 : -1));

var todaysData: PersistedData = {};
if (storedDates.length > 0 && todaysDate !== printDateComponent(storedDates[0].getTime())) {
    const lastDate = printDateComponent(storedDates[0].getTime());
    const data = localStorage.getItem(lastDate) || "{}";
    const lastData = JSON.parse(data);
    todaysData.timer = lastData.timer;

    var stopwatch: StopwatchType = lastData.stopwatch;
    if (stopwatch.state === StopwatchState.Started) {
        todaysData.stopwatch = stopwatch;
    }
    localStorage.setItem(todaysDate, JSON.stringify(todaysData));
} else {
    const data = localStorage.getItem(todaysDate) || "{}";
    todaysData = JSON.parse(data);
}

const appReducer = combineReducers({
    stopwatch: stopwatchReducer,
    records: recordsReducer,
    timer: timerReducer,
})

const rootReducer: typeof appReducer = (state, action): RootState => {
    if (action.type === "CONCURRENT_UPDATE") {
        if (JSON.stringify(state) !== JSON.stringify(action.payload)) {
            console.log("CONCURRENT_UPDATE");
            return appReducer(action.payload, action)
        }
        return appReducer(state, action);
    }
    return appReducer(state, action);
}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: todaysData
})

store.subscribe(() => {
    localStorage.setItem(todaysDate, JSON.stringify(store.getState()));
});

window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === todaysDate) {
        const data = localStorage.getItem(todaysDate) || "{}";
        const todaysData = JSON.parse(data);
        store.dispatch({ type: "CONCURRENT_UPDATE", payload: todaysData })
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export { store };
