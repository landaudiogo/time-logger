import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StopwatchState } from "../types";
import { useStopwatch } from "../hooks/useStopwatch"
import { getStringElapsedTime } from "../lib/dateParsing"
import { AppDispatch } from "store";
import { addRecord } from "../store/recordsSlice";
import { tagAdded } from "../store/stopwatchSlice";
import "./styles.css";


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
        <div className="stopwatch-container">
            <h1 className="stopwatch-header">{getStringElapsedTime(elapsedTime)}</h1>
            <div>
                <div className="stopwatch-button-container">
                    <button className="stopwatch-button stopwatch-button-start" onClick={handleStart}>start</button>
                    <button className="stopwatch-button stopwatch-button-stop" onClick={handleStop}>stop</button>
                </div>
            <input className="stopwatch-input-tag" onChange={handleTagInput} value={stopwatch.tag} placeholder="tag" />
            </div>
        </div>
    );
}
