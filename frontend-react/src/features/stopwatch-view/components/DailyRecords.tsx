import React, { useEffect, useState } from "react";
import { LapRecord } from "../types";
import { prettyPrintTimestamp } from "../lib/dateParsing"
import { selectRecords } from "../store";
import { useSelector } from "react-redux";

export default function DailyRecords() {
    const stateRecords = useSelector(selectRecords);

    return (
        <div>
            {Object.values(stateRecords.records).map((lapRecord) => {
                var startDatetimeString = prettyPrintTimestamp(lapRecord.startTime);
                var endDatetimeString = prettyPrintTimestamp(lapRecord.endTime);
                return (
                    <p key={lapRecord.lap}>
                        {startDatetimeString} | {endDatetimeString} | {lapRecord.tag}
                    </p>
                );
            })}
        </div>
    );
}
