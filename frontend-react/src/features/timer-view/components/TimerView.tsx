import React, {useState} from "react"
import { DailyRecords, LapRecord } from "features/stopwatch-view"
import Timer from "./Timer"

export default function() {
    const [record, setRecord] = useState<LapRecord | null>(null);
    return (
        <div>
            <Timer setRecord={setRecord}/>
            <DailyRecords record={record} />
        </div>
    );
}
