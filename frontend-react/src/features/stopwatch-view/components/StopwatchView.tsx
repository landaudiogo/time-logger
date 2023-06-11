import React from "react";
import { useSelector } from "react-redux";

import Stopwatch from "./Stopwatch";
import DailyRecords from "./DailyRecords";
import { selectRecords } from "../store/recordsSlice";
import "./styles.css";


export default function StopwatchView() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="stopwatch-page">
            <Stopwatch />
            <DailyRecords day={today}/>
        </div>
    );
}
