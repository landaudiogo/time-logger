import React, { useState, useRef } from "react"
import { LapRecord, prettyPrintTimestamp } from "features/stopwatch-view"
import { TimerType } from "../types"

type TimerPropsType = {
    setRecord: React.Dispatch<React.SetStateAction<LapRecord | null>>
}
enum TimerUnit {
    Hours, Minutes, Seconds
}


const DefaultTimer: Date = new Date(0);

export default function Timer(props: TimerPropsType) {
    const setRecord = props.setRecord
    const [timer, setTimer] = useState<Date>(DefaultTimer)
    const totalTimer = useRef<Date>(DefaultTimer);
    const [disabled, setDisabled] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timer | null>(null);
    const startTime = useRef<number>(0)

    function onChangeTimer(timerUnit: TimerUnit) {
        const handleTimerCallback = (e: React.FormEvent<HTMLInputElement>) => {
            return handleTimerInput(e.currentTarget.value, timerUnit)
        }
        return handleTimerCallback
    }

    function handleTimerInput(value: string, timerUnit: TimerUnit) {
        var val = 0;
        val = parseInt(value);
        const curr = totalTimer.current;
        if (isNaN(val))
            val = 0
        if (timerUnit === TimerUnit.Hours) {
            val = val > 23 ? 23 : val;
            val = val < 0 ? 0 : val;
            val = val - Math.floor(curr.getTimezoneOffset()/60);
            totalTimer.current = new Date(totalTimer.current);
            totalTimer.current.setHours(val);
        } else if (timerUnit === TimerUnit.Minutes) {
            val = val > 59 ? 59 : val;
            val = val < 0 ? 0 : val;
            totalTimer.current = new Date(totalTimer.current);
            totalTimer.current.setMinutes(val);
        } else if (timerUnit === TimerUnit.Seconds) {
            val = val > 59 ? 59 : val;
            val = val < 0 ? 0 : val;
            totalTimer.current = new Date(totalTimer.current);
            totalTimer.current.setSeconds(val);
        }
        setTimer(totalTimer.current);
    }

    function handleInterval() {
        const diff = Date.now() - startTime.current;
        const totalMiliSeconds = totalTimer.current.getTime()%86400;
        if ((totalMiliSeconds - diff) < 0) { 
            handleStop();
            return;
        }
        setTimer(new Date(timer.getTime() - diff));
    }

    function handleStart() {
        if (!(totalTimer.current.getTime()%86400))
            return
        setDisabled(true);
        startTime.current = Date.now();
        intervalRef.current = setInterval(handleInterval, 1000);
    }

    function handleStop() {
        if (!intervalRef.current)
            return
        setDisabled(false);
        totalTimer.current = DefaultTimer;
        setTimer(totalTimer.current)
        clearInterval(intervalRef.current);
    }

    return (
        <div>
            <input 
                onChange={onChangeTimer(TimerUnit.Hours)} 
                disabled={disabled} 
                value={prettyPrintTimestamp(timer.getTime()).split(":")[0]}
            />
            :<input 
                onChange={onChangeTimer(TimerUnit.Minutes)} 
                disabled={disabled} 
                value={prettyPrintTimestamp(timer.getTime()).split(":")[1]}
            />
            :<input 
                onChange={onChangeTimer(TimerUnit.Seconds)} 
                disabled={disabled} 
                value={prettyPrintTimestamp(timer.getTime()).split(":")[2]}
            />
            <br />
            <p>{prettyPrintTimestamp(timer.getTime())}</p>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    )
}
