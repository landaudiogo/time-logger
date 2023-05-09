import React from "react";
import { Link } from "react-router-dom";
import Stopwatch from "./Stopwatch";
import DailyRecords from "./DailyRecords";


export default function StopwatchView() {
    return (
        <div>
            <Link to="/timer">timer</Link>
            <Stopwatch />
            <DailyRecords />
        </div>
    );
}
