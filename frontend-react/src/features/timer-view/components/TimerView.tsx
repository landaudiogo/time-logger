import React from "react"
import { Link } from "react-router-dom";
import { DailyRecords } from "features/stopwatch-view"
import Timer from "./Timer"

export default function() {
    return (
        <div>
            <Link to="/stopwatch">stopwatch</Link>
            <Timer />
            <DailyRecords />
        </div>
    );
}
