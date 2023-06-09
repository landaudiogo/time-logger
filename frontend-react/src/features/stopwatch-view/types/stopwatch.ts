import * as t from "io-ts";

export const enum StopwatchState {
    Initialized = "initialized",
    Started = "started", 
    Stopped = "stopped",
}


export const StopwatchIO = t.type({
    state: t.string,
    startTime: t.union([t.number, t.null]),
    endTime: t.union([t.number, t.null]),
    tag: t.string,
});
export type Stopwatch = t.TypeOf<typeof StopwatchIO>;

export const StopwatchStorageIO = t.type({
    stopwatch: StopwatchIO,
    version: t.string,
});
export type StopwatchStorage = t.TypeOf<typeof StopwatchStorageIO>;


export type LapRecord = {
    id: string,
    startTime: number, 
    endTime: number,
    tag: string,
}

