import React from "react";
import { Link } from "react-router-dom";
import Stopwatch from "./Stopwatch";
import DailyRecords from "./DailyRecords";
import "./styles.css";


export default function StopwatchView() {
    return (
        <div className="stopwatch-page">
            <Link to="/timer">timer</Link>
            <Stopwatch />
            <DailyRecords />
        </div>
    );
}
