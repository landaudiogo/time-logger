import StopwatchView from "./components/StopwatchView"
import DailyRecords from "./components/DailyRecords"
import { LapRecord, StopwatchState } from "./types"
import { printTimeComponent, printDateComponent } from "./lib/dateParsing";
import { useStopwatch } from "./hooks/useStopwatch";
import { stopwatchReducer, recordsReducer, selectRecords } from "./store";
import { StopwatchType } from "./types";

export { 
    DailyRecords, printTimeComponent, printDateComponent, useStopwatch, StopwatchState,
    stopwatchReducer, recordsReducer, selectRecords
};
export type { LapRecord, StopwatchType };
export default StopwatchView;
