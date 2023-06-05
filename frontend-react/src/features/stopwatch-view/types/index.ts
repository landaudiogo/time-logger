export const enum StopwatchState {
    Initialized = "initialized",
    Started = "started", 
    Stopped = "stopped",
}

export type StopwatchType = {
    state: StopwatchState,
    startTime: number | null,
    endTime: number | null,
    tag: string,
}

export type LapRecord = {
    id: string,
    startTime: number, 
    endTime: number,
    tag: string,
}

