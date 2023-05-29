import React, { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux";
import { printTimeComponent, StopwatchState, useStopwatch } from "features/stopwatch-view"
import { tagAdded, addRecord } from "features/stopwatch-view/store";
import { AppDispatch } from "store";
import bell from "assets/bell.mp3";
import "./styles.css"

enum TimerUnit {
    Hours, Minutes, Seconds
}

const DefaultTimer: Date = new Date(1000*60*25);

export default function Timer() {
    const { elapsedTime, stopwatch, handleStart, handleStop } = useStopwatch();
    const dispatch: AppDispatch = useDispatch();
    const [timerRemaining, setTimerRemaining] = useState<Date>(DefaultTimer);
    const [timerDuration, setTimerDuration] = useState<Date>(DefaultTimer);
    const timerDurationRef = useRef<Date>(timerDuration);
    timerDurationRef.current = timerDuration;
    const terminated = useRef<boolean>(false);
    const a = new Audio(bell);

    useEffect(() => {
        if (terminated.current === true){
            return;
        }
        if (timerDuration.getTime() - elapsedTime < 0) {
            a.play();
            terminated.current = true;
        }
        const remainingTimeDate = new Date(
            Math.max(timerDuration.getTime() - elapsedTime, 0)
        );
        setTimerRemaining(remainingTimeDate);
    }, [elapsedTime, timerDuration])

    useEffect(() => {
        switch (stopwatch.state) {
            case (StopwatchState.Stopped):
                if (!stopwatch.startTime || !stopwatch.endTime)
                    throw new Error("stopwatch in inconsistent state")
                const remainingTimeDate = new Date(timerDuration.getTime() - elapsedTime);
                setTimerRemaining(remainingTimeDate)
                dispatch(addRecord());
                break;
            case (StopwatchState.Initialized):
                terminated.current = false;
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
        <div className="timer-container">
            <div className="timer-container-duration">
                <input
                    className="timer-input-time-component"
                    onChange={onChangeTimer(TimerUnit.Hours)}
                    disabled={disabled}
                    value={
                        printTimeComponent(
                            timerDuration.getTime(),
                            "UTC",
                        ).split(":")[0]
                    }
                />
                <span className="timer-text-colon">:</span>
                <input
                    className="timer-input-time-component"
                    onChange={onChangeTimer(TimerUnit.Minutes)}
                    disabled={disabled}
                    value={
                        printTimeComponent(
                            timerDuration.getTime(),
                            "UTC"
                        ).split(":")[1]
                    }
                />
                <span className="timer-text-colon">:</span>
                <input
                    className="timer-input-time-component"
                    onChange={onChangeTimer(TimerUnit.Seconds)}
                    disabled={disabled}
                    value={
                        printTimeComponent(
                            timerDuration.getTime(),
                            "UTC"
                        ).split(":")[2]
                    }
                />
            </div>
            <h1 
                className={
                    (stopwatch.state === StopwatchState.Started && timerRemaining.getTime() <= 0) ? 
                        "timer-remaining-text" : ""
                }
            >
                {printTimeComponent(timerRemaining.getTime(), "UTC")}</h1>
            <div className="timer-buttons-tag-container">
                <div className="timer-button-container">
                    <button className="timer-button timer-button-start" onClick={onStart}>start</button>
                    <button className="timer-button timer-button-stop" onClick={handleStop}>stop</button>
                </div>
                <div>
                    <input className="timer-input-tag" onChange={handleTagInput} value={stopwatch.tag} placeholder="tag"/>
                </div>
            </div>
        </div>
    );
}
