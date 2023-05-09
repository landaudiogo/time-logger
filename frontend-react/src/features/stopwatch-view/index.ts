import StopwatchView from "./components/StopwatchView"
import DailyRecords from "./components/DailyRecords"
import { LapRecord } from "./types"
import { prettyPrintTimestamp } from "./lib/dateParsing";
import { useStopwatch, StopwatchState } from "./hooks/useStopwatch";

export { DailyRecords, prettyPrintTimestamp, useStopwatch, StopwatchState };
export type { LapRecord };
export default StopwatchView;
