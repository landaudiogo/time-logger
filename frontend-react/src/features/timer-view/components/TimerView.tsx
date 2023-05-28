import React from "react";
import { Link } from "react-router-dom";
import { DailyRecords } from "features/stopwatch-view"
import Timer from "./Timer"
import "./styles.css"

export default function TimerView() {
    return (
        <div className="timer-page">
            <Timer />
            <DailyRecords />
        </div>
    );
}
