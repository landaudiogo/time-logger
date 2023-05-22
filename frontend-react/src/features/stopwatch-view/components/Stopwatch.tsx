import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StopwatchState } from "../types";
import { useStopwatch } from "../hooks/useStopwatch"
import { getStringElapsedTime } from "../lib/dateParsing"
import { AppDispatch } from "store";
import { addRecord } from "../store/recordsSlice";
import { tagAdded } from "../store/stopwatchSlice";


export default function Stopwatch() {
    const dispatch: AppDispatch = useDispatch();
    const {
        elapsedTime,
        stopwatch,
        handleStart,
        handleStop,
    } = useStopwatch();

    useEffect(() => {
        switch (stopwatch.state) {
            case StopwatchState.Stopped:
                if (!stopwatch.startTime || !stopwatch.endTime)
                    throw new Error("stopwatch in inconsistent state")
                dispatch(addRecord());
                break;
        }
    }, [stopwatch]);

    function handleTagInput(e: React.FormEvent<HTMLInputElement>) {
        dispatch(tagAdded({ tag: e.currentTarget.value }))

    }

    return (
        <div>
            <h1>{getStringElapsedTime(elapsedTime)}</h1>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
            <br />
            <br />
            <input onChange={handleTagInput} value={stopwatch.tag} placeholder="tag" />
            <br />
            <br />
        </div>
    );
}
