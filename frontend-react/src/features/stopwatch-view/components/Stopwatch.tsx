import React, { useState, useRef } from "react";
import { LapRecord } from "../types";

function getStringElapsedTime(elapsedTime: number) {
    return new Date(elapsedTime).toISOString()
        .split("T")[1]
        .replace("Z", "")
        .split(".")[0];
}

type StopwatchPropsType = {
    setRecord: React.Dispatch<React.SetStateAction<LapRecord | null>>
}

export default function Stopwatch(
    props: StopwatchPropsType
) {
    const startTime = useRef<number | null>(null);
    const currentTimer = useRef<NodeJS.Timer | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const setRecord = props.setRecord

    function handleTimerEvent() {
        const now = Date.now();
        if (!startTime.current)
            throw new Error("startTime cannot be falsy when handling timer event.")
        setElapsedTime(now - startTime.current);
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
        setElapsedTime(0);
        const start = startTime.current;
        startTime.current = null;
        clearInterval(currentTimer.current);
        currentTimer.current = null;
        setRecord({ start: start, end: Date.now() });
    }

    return (
        <div>
            <h1>{getStringElapsedTime(elapsedTime)}</h1>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
}
