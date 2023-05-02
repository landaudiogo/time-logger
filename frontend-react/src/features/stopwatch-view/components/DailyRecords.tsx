import React, { useEffect, useState } from "react";
import { LapRecord } from "../types";

type DailyRecordsPropsType = {
    record: LapRecord | null
}

export default function DailyRecords(
    props: DailyRecordsPropsType
) {
    const record = props.record;
    const [records, setRecords] = useState<Array<LapRecord>>([])

    useEffect(() => {
        if(!record) 
            return
        setRecords((curr) => [...curr, record])
    }, [record])

    return (
        <div>
            {records.map((elem: LapRecord, idx) => {
                var startDatetimeString = new Date(elem.start).toISOString();
                startDatetimeString = startDatetimeString
                    .replace('T', ' ')
                    .replace('Z', '')
                    .split('.')[0];
                var endDatetimeString = new Date(elem.end).toISOString();
                endDatetimeString = endDatetimeString
                    .replace('T', ' ')
                    .replace('Z', '')
                    .split('.')[0];
                return (
                    <p key={idx}>
                        {startDatetimeString} | {endDatetimeString}
                    </p>
                );
            })}
        </div>
    );
}
