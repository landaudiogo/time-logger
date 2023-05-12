import React, { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux";
import { prettyPrintTimestamp, StopwatchState, useStopwatch } from "features/stopwatch-view"
import { tagAdded, addRecord } from "features/stopwatch-view/store";
import { AppDispatch } from "store";
import bell from "assets/bell.mp3";

enum TimerUnit {
    Hours, Minutes, Seconds
}

const DefaultTimer: Date = new Date(0);

export default function Timer() {
    const { elapsedTime, stopwatch, handleStart, handleStop } = useStopwatch();
    const dispatch: AppDispatch = useDispatch();
    const [timerRemaining, setTimerRemaining] = useState<Date>(DefaultTimer);
    const [timerDuration, setTimerDuration] = useState<Date>(DefaultTimer);
    const timerDurationRef = useRef<Date>(timerDuration);
    timerDurationRef.current = timerDuration;

    useEffect(() => {
        if (timerDuration.getTime() - elapsedTime < 0) {
            handleStop();
        }
        const remainingTimeDate = new Date(timerDuration.getTime() - elapsedTime);
        setTimerRemaining(remainingTimeDate)
    }, [elapsedTime, timerDuration])

    useEffect(() => {
        switch (stopwatch.state) {
            case (StopwatchState.Stopped):
                const a = new Audio(bell);
                a.play();
                if (!stopwatch.startTime || !stopwatch.endTime)
                    throw new Error("stopwatch in inconsistent state")
                dispatch(addRecord());
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
        dispatch(tagAdded({tag: e.currentTarget.value}));
    }

    function onStart() {
        if (timerDuration.getTime() <= 0)
            return;
        handleStart();
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
            timerDurationRef.current = new Date(timerDurationRef.current);
            timerDurationRef.current.setUTCHours(val);
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

    const disabled = stopwatch.state === StopwatchState.Started;
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
            <input onChange={handleTagInput} value={stopwatch.tag} />
            <p>{prettyPrintTimestamp(timerRemaining.getTime())}</p>
            <button onClick={onStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
}
