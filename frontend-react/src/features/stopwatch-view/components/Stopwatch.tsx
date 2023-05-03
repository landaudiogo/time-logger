import React from "react";
import { LapRecord } from "../types";
import { useElapsedTime } from "../hooks/useTimer"
import { getStringElapsedTime } from "../lib/dateParsing"


type StopwatchPropsType = {
    setRecord: React.Dispatch<React.SetStateAction<LapRecord | null>>
}

export default function Stopwatch(
    props: StopwatchPropsType
) {
    const { elapsedTime, handleStop, handleStart, handleTagInput } = useElapsedTime(props.setRecord)
    return (
        <div>
            <h1>{getStringElapsedTime(elapsedTime)}</h1>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
            <br />
            <input onChange={handleTagInput} />
        </div>
    );
}
