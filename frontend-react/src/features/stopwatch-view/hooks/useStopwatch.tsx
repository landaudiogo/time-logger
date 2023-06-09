import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {AppDispatch} from "store";

import { selectStopwatch, stopwatchStarted, stopwatchStopped } from "../store";
import { Stopwatch, StopwatchState } from "../types/stopwatch";


export function useStopwatch() {
    const stopwatch = useSelector(selectStopwatch);
    const stopwatchRef = useRef<Stopwatch>(stopwatch);
    stopwatchRef.current = stopwatch;
    const dispatch: AppDispatch = useDispatch();
    const intervalRef = useRef<NodeJS.Timer | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        if (stopwatchRef.current.state !== StopwatchState.Started)
            return;
        if (!stopwatchRef.current.startTime)
            throw new Error("Inconsistent stopwatch state");
        intervalRef.current = setInterval(handleTimerEvent, 1000);
        setElapsedTime(Date.now() - stopwatchRef.current.startTime);
        return () => {
            if (!intervalRef.current)
                return;
            clearInterval(intervalRef.current);
        };
    }, [])

    useEffect(() => {
        if ((stopwatch.state === StopwatchState.Started) 
            && (intervalRef.current === null)
        ) {
            intervalRef.current = setInterval(handleTimerEvent, 1000);
        }
        if ((stopwatch.state === StopwatchState.Stopped) 
            && (intervalRef.current !== null)
        ) {
            setElapsedTime(0);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [stopwatch])


    
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
