import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';

import { Tag } from "features/tag";

import { StopwatchState } from "../types/stopwatch";
import { useStopwatch } from "../hooks/useStopwatch"
import { getStringElapsedTime } from "../lib/dateParsing"
import { AppDispatch } from "store";
import { addRecord } from "../store/recordsSlice";
import { tagAdded, selectStopwatch } from "../store/stopwatchSlice";
import "./styles.css";


export default function Stopwatch() {
    const dispatch: AppDispatch = useDispatch();
    const tag = useSelector(selectStopwatch).tag
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

    return (
        <div className="stopwatch-container">
            <h1 className="stopwatch-header">{getStringElapsedTime(elapsedTime)}</h1>
            <div>
                <div className="stopwatch-button-container">
                    <button 
                        className="stopwatch-button stopwatch-button-start" 
                        onClick={handleStart}
                    >
                        <PlayArrowOutlinedIcon className="stopwatch-icon"/>
                    </button>
                    <button 
                        className="stopwatch-button stopwatch-button-stop" 
                        onClick={handleStop}
                    >
                        <StopOutlinedIcon className="stopwatch-icon"/>
                    </button>
                </div>
                <div className="stopwatch-tag-container">
                    <Tag 
                        value={tag} 
                        onTagChange={(tag) => dispatch(tagAdded({tag: tag}))}
                    />
                </div>
            </div>
        </div>
    );
}
