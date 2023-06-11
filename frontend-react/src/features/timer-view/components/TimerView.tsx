import React from "react";
import {useSelector} from "react-redux";

import { 
    DailyRecords, selectRecords
} from "features/stopwatch-view"
import Timer from "./Timer"
import "./styles.css"

export default function TimerView() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="timer-page">
            <Timer />
            <DailyRecords day={today}/>
        </div>
    );
}
