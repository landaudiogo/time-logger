import StopwatchView from "./components/StopwatchView"
import DailyRecords from "./components/DailyRecords"
import { LapRecord, StopwatchState } from "./types/stopwatch"
import { printTimeComponent, printDateComponent, validateDateInput } from "./lib/dateParsing";
import { useStopwatch } from "./hooks/useStopwatch";
import { 
    tagAdded, stopwatchReducer, selectStopwatch ,
    recordsReducer, selectRecords } from "./store";
import { Stopwatch } from "./types/stopwatch";

export { 
    DailyRecords, printTimeComponent, printDateComponent, useStopwatch, StopwatchState,
    stopwatchReducer, recordsReducer, selectRecords, validateDateInput, tagAdded, selectStopwatch
};
export type { LapRecord, Stopwatch };
export default StopwatchView;
