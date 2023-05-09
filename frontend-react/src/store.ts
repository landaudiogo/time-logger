import { configureStore } from "@reduxjs/toolkit";
import { stopwatchReducer, recordsReducer } from "features/stopwatch-view";

const store = configureStore({
    reducer: {
        stopwatch: stopwatchReducer,
        records: recordsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export { store };
