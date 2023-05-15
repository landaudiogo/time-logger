import React from "react";
import { prettyPrintTimestamp } from "../lib/dateParsing"
import { selectRecords } from "../store";
import { useSelector } from "react-redux";


export default function DailyRecords() {
    const stateRecords = useSelector(selectRecords);

    const totalTime = Object.values(stateRecords.records).reduce<Record<string, number>>(
        (accumulator, currentValue) => {
            var val = 0;
            if (accumulator[currentValue.tag] !== undefined)
                val = accumulator[currentValue.tag];
            accumulator[currentValue.tag] = val + (currentValue.endTime - currentValue.startTime);
            return accumulator;
        }, 
        {}
    );
    const dailyRecords = Object.values(stateRecords.records).map((lapRecord) => {
        var startDatetimeString = prettyPrintTimestamp(lapRecord.startTime);
        var endDatetimeString = prettyPrintTimestamp(lapRecord.endTime);
        return (
            <p key={lapRecord.lap}>
                {startDatetimeString} | {endDatetimeString} | {lapRecord.tag}
            </p>
        );
    })

    const summary = Object.entries(totalTime).map(([tag, totalMs]) => (
        <p key={tag}>
            {tag} | {prettyPrintTimestamp(totalMs)}
        </p>
    ));

    return (
        <div>
            {summary}
            {dailyRecords}
        </div>
    );
}
