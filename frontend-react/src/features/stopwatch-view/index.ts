import StopwatchView from "./components/StopwatchView";
import DailyRecords from "./components/DailyRecords";

import { StopwatchState, Stopwatch } from "./types/stopwatch"
import { LapRecord } from "./types/records";

import { printTimeComponent, printDateComponent, validateDateInput } from "./lib/dateParsing";
import { 
    loadRecordsFromLocalStorage, recordsStorageToState, 
    loadStopwatchFromLocalStorage, stopwatchStorageToState,
} from "./lib/storage";

import { useStopwatch } from "./hooks/useStopwatch";
import { recordsAdded } from "./store/recordsSlice";
import {
    tagAdded, stopwatchReducer, selectStopwatch,
    recordsReducer, selectRecords
} from "./store";

export {
    DailyRecords, printTimeComponent, printDateComponent, useStopwatch, StopwatchState,
    stopwatchReducer, recordsReducer, selectRecords, validateDateInput, tagAdded, selectStopwatch, 
    recordsAdded
};

export { 
    loadRecordsFromLocalStorage, recordsStorageToState, 
    loadStopwatchFromLocalStorage, stopwatchStorageToState,
};
export type { LapRecord, Stopwatch };
export default StopwatchView;
