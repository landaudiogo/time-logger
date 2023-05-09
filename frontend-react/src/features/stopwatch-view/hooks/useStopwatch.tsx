import { useState, useRef } from "react";
import { LapRecord } from "../types"


export enum StopwatchState {
    Initialized,
    Started,
    Stopped
}

type StopwatchType = {
    stopwatchState: StopwatchState,
    startTime?: number,
    endTime?: number,
}

const DefaultStopwatch: StopwatchType = { 
    stopwatchState: StopwatchState.Initialized,
}

export function useStopwatch() {
    const [stopwatch, setStopwatch] = useState<StopwatchType>(DefaultStopwatch);
    const stopwatchRef = useRef<StopwatchType>(stopwatch);
    const intervalRef = useRef<NodeJS.Timer | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    stopwatchRef.current = stopwatch;

    function handleTimerEvent() {
        if (stopwatchRef.current.startTime === undefined)
            throw new Error("startTime has to be initialized");
        const startTime = stopwatchRef.current.startTime;
        const now = Date.now();
        setElapsedTime(now - startTime);
    }

    function handleStart() {
        const startTime = stopwatchRef.current.startTime;
        const stopTime = stopwatchRef.current.endTime;
        if (startTime && stopTime === undefined)
            return;

        setStopwatch({
            startTime: Date.now(),
            stopwatchState: StopwatchState.Started
        });
        intervalRef.current = setInterval(handleTimerEvent, 1000);
    }

    function handleStop() {
        const stopwatch = stopwatchRef.current;
        if (stopwatch.startTime && stopwatch.endTime)
            return; 
        if (!intervalRef.current)
            throw new Error("Missing references");
        setElapsedTime(0);
        setStopwatch((curr) => (
            { 
                ...curr, 
                endTime: Date.now(),
                stopwatchState: StopwatchState.Stopped,
            }
        ));
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    return { elapsedTime, stopwatch, handleStart, handleStop };
}
