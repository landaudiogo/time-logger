import { isLeft } from "fp-ts/Either";

import { 
    StopwatchStorageIO, StopwatchStorage,
    StopwatchIO, Stopwatch, 
    StopwatchState,
} from "../types/stopwatch";
import { 
    RecordsStorageV1IO, RecordsStorageV1, 
    RecordsStorageV0IO, RecordsStorageV0,
    Records
} from "../types/records";
import { printDateComponent } from "./dateParsing";


const stopwatchStorageKey = "stopwatch";

const defaultStopwatch: Stopwatch = {
    state: StopwatchState.Initialized,
    startTime: null,
    endTime: null,
    tag: "",
};

const defaultRecords = {}


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
    return stopwatchStorage === null ? defaultValue : stopwatchStorage.stopwatch;
}


function recordsDecodeV0(recordsObject: any): RecordsStorageV1 | null {
    if (recordsObject.records === undefined 
        || recordsObject.records.records === undefined
    ) {
        return null;
    }

    recordsObject = {
        records: Object.values(recordsObject.records.records)
    };
    const decoded = RecordsStorageV0IO.decode(recordsObject);
    if (isLeft(decoded)) {
        return null;
    }
    const decodedRecordsStorage: RecordsStorageV0 = decoded.right;
    const result = {
        ...decodedRecordsStorage, 
        version: "v1",
    } 
    return result;
}

function recordsDecodeV1(recordsObject: any): RecordsStorageV1 | null { 
    const decoded = RecordsStorageV1IO.decode(recordsObject);
    if (isLeft(decoded)) {
        return null;
    }
    const decodedTagsStorage: RecordsStorageV1 = decoded.right;
    return decodedTagsStorage;
}

function recordsEncodeV1(recordsObject: Records): RecordsStorageV1 {
    return {
        records: Object.values(recordsObject),
        version: "v1"
    }
}

export function loadRecordsFromLocalStorage(date: Date): RecordsStorageV1 | null {
    const dateString = printDateComponent(date.getTime());
    const recordsJSON = localStorage.getItem(dateString);
    if (recordsJSON === null || recordsJSON === "") {
        return null;
    }
    let recordsObject: any = {};
    try {
        recordsObject = JSON.parse(recordsJSON);
    } catch (error) { }

    let recordsState;
    if (recordsObject.version === undefined) {
        recordsState = recordsDecodeV0(recordsObject);
    } else {
        recordsState = recordsDecodeV1(recordsObject);
    }

    return recordsState;
}

export function recordsStorageToState(
    recordsStorage: RecordsStorageV1 | null,
    defaultValue: Records = defaultRecords
): Records { 
    if (recordsStorage === null) {
        return defaultValue;
    }
    return Object.values(recordsStorage.records).reduce(
        (acc, record) => {
            acc[record.id] = record;
            return acc;
        },
        {} as Records
    )
}

export function recordsToLocalStorage(records: Records, date: Date) {
    const dateString = printDateComponent(date.getTime());
    const recordsStorage = recordsEncodeV1(records);
    localStorage.setItem(dateString, JSON.stringify(recordsStorage));
}
