import React, { useState, useRef } from "react";
import { ElapsedTimeType, LapRecord } from "../types";

function getStringElapsedTime(elapsedTime: ElapsedTimeType) { 
    const hours = elapsedTime.hours > 9 ? `${elapsedTime.hours}` : `0${elapsedTime.hours}`;
    const minutes = elapsedTime.minutes > 9 ? `${elapsedTime.minutes}` : `0${elapsedTime.minutes}`;
    const seconds = elapsedTime.seconds > 9 ? `${elapsedTime.seconds}` : `0${elapsedTime.seconds}`;
    return `${hours}:${minutes}:${seconds}`;
}
const defaultElapsedTime: ElapsedTimeType = { 
    hours: 0, 
    minutes: 0, 
    seconds: 0,
}

type StopwatchPropsType = {
    setRecords: React.Dispatch<React.SetStateAction<LapRecord[]>>
}

export default function Stopwatch(
    props: StopwatchPropsType
) {
    const startTime = useRef<number | null>(null);
    const currentTimer = useRef<NodeJS.Timer | null>(null);
    const [elapsedTime, setElapsedTime] = useState<ElapsedTimeType>(defaultElapsedTime);

    function handleTimerEvent() { 
        const now = Date.now();
        if(!startTime.current)
            throw new Error("startTime cannot be falsy when handling timer event.")
        const timeDifference = now - startTime.current;
        setElapsedTime({
            hours: Math.floor(timeDifference / 1000 / 60 / 60) % 24, 
            minutes: Math.floor(timeDifference / 1000 / 60) % 60, 
            seconds: Math.floor(timeDifference / 1000) % 60
        });
    }

    function handleStart() {
        if (startTime.current || currentTimer.current)
            return;
        startTime.current = Date.now(); 
        currentTimer.current = setInterval(handleTimerEvent, 1000);
    }

    function handleStop() { 
        if (!currentTimer.current || !startTime.current)
            return;
        setElapsedTime({hours: 0, minutes: 0, seconds: 0});
        const start = startTime.current;
        startTime.current = null;
        clearInterval(currentTimer.current);
        currentTimer.current = null;
        props.setRecords((current) => {
            const newArray = [...current, {start: start, end: Date.now()}]; 
            return newArray;
        })
    }
    
    return (
        <div>
            <h1>{getStringElapsedTime(elapsedTime)}</h1>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
}
