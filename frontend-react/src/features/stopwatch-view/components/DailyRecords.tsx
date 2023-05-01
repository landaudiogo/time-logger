import React from "react";
import { LapRecord } from "../types";

type DailyRecordsPropsType = {
    records: Array<LapRecord>
}

export default function DailyRecords(
    props: DailyRecordsPropsType
) {
    const records = props.records;

    return (
        <div>
            {records.map((elem) => {
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
                    <p>
                        {startDatetimeString} | {endDatetimeString}
                    </p>
                );
            })}
        </div>
    );
}