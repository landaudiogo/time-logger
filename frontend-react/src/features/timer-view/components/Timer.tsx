import React, { useState, useRef, useEffect } from "react"
import { LapRecord, prettyPrintTimestamp, StopwatchState, useStopwatch } from "features/stopwatch-view"
import { TimerType } from "../types"

type TimerPropsType = {
    setRecord: React.Dispatch<React.SetStateAction<LapRecord | null>>
}
enum TimerUnit {
    Hours, Minutes, Seconds
}


const DefaultTimer: Date = new Date(0);

export default function Timer(props: TimerPropsType) {
    const { elapsedTime, stopwatch, handleStart, handleStop} = useStopwatch();
    const [timerRemaining, setTimerRemaining] = useState<Date>(DefaultTimer);
    const [timerDuration, setTimerDuration] = useState<Date>(DefaultTimer);
    const timerDurationRef = useRef<Date>(timerDuration);
    const lapCount = useRef<number>(0);
    const [tag, setTag] = useState<string>("");
    const disabled = stopwatch.stopwatchState === StopwatchState.Started;
    timerDurationRef.current = timerDuration;

    useEffect(() => {
        if (timerDuration.getTime() - elapsedTime < 0) {
            handleStop();
        }
        const remainingTimeDate = new Date(timerDuration.getTime() - elapsedTime);
        setTimerRemaining(remainingTimeDate)
    }, [elapsedTime, timerDuration])

    useEffect(() => {
        switch(stopwatch.stopwatchState) {
            case(StopwatchState.Stopped): 
                if (stopwatch.startTime === undefined || stopwatch.endTime === undefined)
                    throw new Error("stopwatch in inconsistent state")
                props.setRecord({
                    lap: lapCount.current,
                    start: stopwatch.startTime,
                    end: stopwatch.endTime,
                    tag: tag,
                })
                lapCount.current = lapCount.current + 1;
                break;
        }
    }, [stopwatch])

    function onChangeTimer(timerUnit: TimerUnit) {
        const handleTimerCallback = (e: React.FormEvent<HTMLInputElement>) => {
            return handleTimerInput(e.currentTarget.value, timerUnit)
        }
        return handleTimerCallback
    }

    function handleTagInput(e: React.FormEvent<HTMLInputElement>) {
        setTag(e.currentTarget.value)
    }

    function handleTimerInput(value: string, timerUnit: TimerUnit) {
        var val = 0;
        val = parseInt(value);
        const curr = timerDurationRef.current;
        if (isNaN(val))
            val = 0
        if (timerUnit === TimerUnit.Hours) {
            val = val > 23 ? 23 : val;
            val = val < 0 ? 0 : val;
            val = val - Math.floor(curr.getTimezoneOffset()/60);
            timerDurationRef.current = new Date(timerDurationRef.current);
            timerDurationRef.current.setHours(val);
        } else if (timerUnit === TimerUnit.Minutes) {
            val = val > 59 ? 59 : val;
            val = val < 0 ? 0 : val;
            timerDurationRef.current = new Date(timerDurationRef.current);
            timerDurationRef.current.setMinutes(val);
        } else if (timerUnit === TimerUnit.Seconds) {
            val = val > 59 ? 59 : val;
            val = val < 0 ? 0 : val;
            timerDurationRef.current = new Date(timerDurationRef.current);
            timerDurationRef.current.setSeconds(val);
        }
        setTimerDuration(timerDurationRef.current);
    }

    return (
        <div>
            <input 
                onChange={onChangeTimer(TimerUnit.Hours)} 
                disabled={disabled} 
                value={prettyPrintTimestamp(timerDuration.getTime()).split(":")[0]}
            />
            :<input 
                onChange={onChangeTimer(TimerUnit.Minutes)} 
                disabled={disabled} 
                value={prettyPrintTimestamp(timerDuration.getTime()).split(":")[1]}
            />
            :<input 
                onChange={onChangeTimer(TimerUnit.Seconds)} 
                disabled={disabled} 
                value={prettyPrintTimestamp(timerDuration.getTime()).split(":")[2]}
            />
            <br />
            <input onChange={handleTagInput} />
            <p>{prettyPrintTimestamp(timerRemaining.getTime())}</p>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    )
}
