import { configureStore } from "@reduxjs/toolkit";
import { stopwatchReducer, recordsReducer } from "features/stopwatch-view";
import { useDispatch } from "react-redux";
import { printDateComponent } from './features/stopwatch-view';

const todaysDate: string = printDateComponent(new Date().getTime());
var todaysDataString = localStorage.getItem(todaysDate);
var todaysData;

if (todaysDataString === null) { 
    const date = new Date();
    date.setHours(0,0,0,0);
    todaysData = {};
    localStorage.setItem(todaysDate, JSON.stringify(todaysData));
} else {
    todaysData = JSON.parse(todaysDataString);
}


const store = configureStore({
    reducer: {
        stopwatch: stopwatchReducer,
        records: recordsReducer,
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
