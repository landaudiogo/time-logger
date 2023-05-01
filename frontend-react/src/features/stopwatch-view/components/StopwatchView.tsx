import React, { useState } from "react";
import Stopwatch from "./Stopwatch";
import DailyRecords from "./DailyRecords";
import { LapRecord } from "../types";


export default function StopwatchView() { 
    const [records, setRecords] = useState<Array<LapRecord>>([]);

    return (
        <div>
            <Stopwatch setRecords={setRecords}/>
            <DailyRecords records={records}/>
        </div>
    );
}
