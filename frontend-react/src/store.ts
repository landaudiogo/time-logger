import { configureStore } from "@reduxjs/toolkit";
import { stopwatchReducer, recordsReducer } from "features/stopwatch-view";
import { timerReducer } from "features/timer-view";
import { useDispatch } from "react-redux";
import { printDateComponent } from './features/stopwatch-view';
import { StopwatchType, StopwatchState } from "./features/stopwatch-view";

const todaysDate: string = printDateComponent(new Date().getTime());


const storedDates = Object.keys(localStorage).filter((key) => {
    if (key.match("[0-9]{2}/[0-9]{2}/[0-9]{2}")) {
        return key;
    }
}).map(key => new Date(key));
storedDates.sort((a,b) => ((a<b) ? 1 : -1));

if (todaysDate !== printDateComponent(storedDates[0].getTime())) { 
    var todaysData = {};
    if (storedDates.length > 0) {
        const lastDate = printDateComponent(storedDates[0].getTime());
        const data = localStorage.getItem(lastDate) || "{}";
        const lastData = JSON.parse(data);
        var stopwatch: StopwatchType = lastData.stopwatch;
        if (stopwatch.state !== StopwatchState.Started) { 
            todaysData = {};
        } else {
            todaysData = {stopwatch: stopwatch}; 
        }
    }
    localStorage.setItem(todaysDate, JSON.stringify(todaysData));
} else {
    const data = localStorage.getItem(todaysDate) || "{}";
    todaysData = JSON.parse(data);
}


const store = configureStore({
    reducer: {
        stopwatch: stopwatchReducer,
        records: recordsReducer,
        timer: timerReducer,
    }, 
    preloadedState: todaysData
})

store.subscribe(() => {
    localStorage.setItem(todaysDate, JSON.stringify(store.getState()));
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export { store };
