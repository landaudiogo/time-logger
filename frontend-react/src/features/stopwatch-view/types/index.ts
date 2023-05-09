export const enum StopwatchState {
    Initialized = "initialized",
    Started = "started", 
    Stopped = "stopped",
}

export type LapRecord = {
    lap: number,
    start: number, 
    end: number,
    tag: string
}

