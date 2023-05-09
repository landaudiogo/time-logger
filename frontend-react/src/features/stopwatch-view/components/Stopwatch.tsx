import React, { useState, useEffect, useRef } from "react";
import { LapRecord } from "../types";
import { StopwatchState, useStopwatch } from "../hooks/useStopwatch"
import { getStringElapsedTime } from "../lib/dateParsing"


type StopwatchPropsType = {
    setRecord: React.Dispatch<React.SetStateAction<LapRecord | null>>
}

export default function Stopwatch(props: StopwatchPropsType) {
    const [tag, setTag] = useState<string>("");
    const lapCount = useRef<number>(0);
    const {
        elapsedTime,
        stopwatch,
        handleStart,
        handleStop,
    } = useStopwatch();


    useEffect(() => {
        switch (stopwatch.stopwatchState) {
            case StopwatchState.Stopped:
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

    function handleTagInput(e: React.FormEvent<HTMLInputElement>) {
        setTag(e.currentTarget.value)
    }

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
