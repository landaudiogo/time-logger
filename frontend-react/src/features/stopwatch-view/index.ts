import StopwatchView from "./components/StopwatchView"
import DailyRecords from "./components/DailyRecords"
import { LapRecord } from "./types"
import { prettyPrintTimestamp } from "./lib/dateParsing";

export { DailyRecords, prettyPrintTimestamp };
export type { LapRecord };
export default StopwatchView;
