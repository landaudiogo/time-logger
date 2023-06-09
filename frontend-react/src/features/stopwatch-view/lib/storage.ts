import { isLeft } from "fp-ts/Either";

import { 
    StopwatchStorageIO, StopwatchStorage,
    StopwatchIO, Stopwatch, 
    StopwatchState,
} from "../types/stopwatch";


const stopwatchStorageKey = "stopwatch";

const defaultStopwatch: Stopwatch = {
    state: StopwatchState.Initialized,
    startTime: null,
    endTime: null,
    tag: "",
};


export function loadStopwatchFromLocalStorage(): StopwatchStorage | null {
    const stopwatchJSON = localStorage.getItem(stopwatchStorageKey);
    if (stopwatchJSON === null || stopwatchJSON === "") {
        return null;
    }
    let stopwatchObject = {};
    try {
        stopwatchObject = JSON.parse(stopwatchJSON);
    } catch (error) { }


    const decoded = StopwatchStorageIO.decode(stopwatchObject);
    if (isLeft(decoded)) {
        console.log("Could not decode");
        return null;
    }
    const decodedTagsStorage: StopwatchStorage = decoded.right;
    return decodedTagsStorage;
}

export function stopwatchToLocalStorage(stopwatch: Stopwatch) {
    const stopwatchStorage = {
        stopwatch: stopwatch,
        version: "v1",
    }
    localStorage.setItem(stopwatchStorageKey, JSON.stringify(stopwatchStorage));
}

export function stopwatchStorageToState(
    stopwatchStorage: StopwatchStorage | null, 
    defaultValue: Stopwatch = defaultStopwatch
): Stopwatch {
    return stopwatchStorage === null ? defaultStopwatch : stopwatchStorage.stopwatch;
}
