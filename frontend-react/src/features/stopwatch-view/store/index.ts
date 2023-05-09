import stopwatchReducer, {
    selectStopwatch, stopwatchStarted, stopwatchStopped, tagAdded
} from "./stopwatchSlice";
import recordsReducer, {
    selectRecords, addRecord
} from "./recordsSlice";

export { stopwatchReducer, selectStopwatch, stopwatchStarted, stopwatchStopped, tagAdded};
export { recordsReducer, selectRecords, addRecord };
