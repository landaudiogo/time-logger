import { StopwatchType } from "features/stopwatch-view";

export type PersistedData = {
    stopwatch?: StopwatchType,
    timer?: {
        duration: number,
    }
    records?: {
        records: {
            [key: string]: {
                startTime: number,
                endTime: number, 
                id: string, 
                tag: string,
            }
        }
    }
}

