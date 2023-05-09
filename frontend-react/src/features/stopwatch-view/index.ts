import StopwatchView from "./components/StopwatchView"
import DailyRecords from "./components/DailyRecords"
import { LapRecord, StopwatchState } from "./types"
import { prettyPrintTimestamp } from "./lib/dateParsing";
import { useStopwatch } from "./hooks/useStopwatch";
import { stopwatchReducer, recordsReducer } from "./store";

export { 
    DailyRecords, prettyPrintTimestamp, useStopwatch, StopwatchState,
    stopwatchReducer, recordsReducer
};
export type { LapRecord };
export default StopwatchView;
