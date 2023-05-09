import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectStopwatch, stopwatchStarted, stopwatchStopped } from "../store";
import { StopwatchType, StopwatchState } from "../types";

export function useStopwatch() {
    const stopwatch = useSelector(selectStopwatch);
    const stopwatchRef = useRef<StopwatchType>(stopwatch);
    stopwatchRef.current = stopwatch;
    const dispatch = useDispatch();
    const intervalRef = useRef<NodeJS.Timer | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    function handleTimerEvent() {
        if (!stopwatchRef.current.startTime)
            throw new Error("startTime has to be initialized");
        const startTime = stopwatchRef.current.startTime;
        const now = Date.now();
        setElapsedTime(now - startTime);
    }

    function handleStart() {
        const startTime = stopwatchRef.current.startTime;
        const stopTime = stopwatchRef.current.endTime;
        if (startTime && !stopTime)
            return;
        dispatch(stopwatchStarted({}));
        intervalRef.current = setInterval(handleTimerEvent, 1000);
    }

    function handleStop() {
        const stopwatch = stopwatchRef.current;
        if (stopwatch.startTime && stopwatch.endTime)
            return; 
        if (stopwatch.state !== StopwatchState.Started)
            return;
        if (!intervalRef.current)
            throw new Error("Missing intervalRef");
        setElapsedTime(0);
        dispatch(stopwatchStopped({}))
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    return { elapsedTime, stopwatch, handleStart, handleStop };
}
