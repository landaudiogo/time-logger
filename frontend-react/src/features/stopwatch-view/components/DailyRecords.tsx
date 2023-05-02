import React, { useEffect, useState } from "react";
import { LapRecord } from "../types";
import { prettyPrintTimestamp } from "../lib/dateParsing"

type DailyRecordsPropsType = {
    record: LapRecord | null
}

export default function DailyRecords(
    props: DailyRecordsPropsType
) {
    const record = props.record;
    const [records, setRecords] = useState<Map<number, LapRecord>>(new Map())

    useEffect(() => {
        if(!record) 
            return
        setRecords((curr: Map<number, LapRecord>) => {
            const newMap = new Map(curr)
            newMap.set(record.lap, record)
            return newMap;
        });
    }, [record])

    return (
        <div>
            {Array.from(records).map(([number, lapRecord]) => {
                var startDatetimeString = prettyPrintTimestamp(lapRecord.start);
                var endDatetimeString = prettyPrintTimestamp(lapRecord.end);
                return (
                    <p key={lapRecord.lap}>
                        {startDatetimeString} | {endDatetimeString} | {lapRecord.tag}
                    </p>
                );
            })}
        </div>
    );
}
