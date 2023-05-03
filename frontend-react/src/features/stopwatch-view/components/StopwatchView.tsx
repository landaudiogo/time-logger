import React, { useState } from "react";
import Stopwatch from "./Stopwatch";
import DailyRecords from "./DailyRecords";
import { LapRecord } from "../types";


export default function StopwatchView() {
    const [record, setRecord] = useState<LapRecord | null>(null);
    
    return (
        <div>
            <Stopwatch setRecord={setRecord} />
            <DailyRecords record={record} />
        </div>
    );
}
