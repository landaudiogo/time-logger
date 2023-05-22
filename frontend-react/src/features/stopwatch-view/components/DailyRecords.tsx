import React, { useRef } from "react";
import { printTimeComponent } from "../lib/dateParsing"
import { selectRecords } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { manualRecordAdded } from "../store/recordsSlice";
import { LapRecord } from "../store/recordsSlice";




function ManualRecord() {
    const dispatch = useDispatch();
    const startTimeRef = useRef<HTMLInputElement>(null);
    const endTimeRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);

    function handleClick() {
        if (startTimeRef.current === null || endTimeRef.current === null || tagRef.current === null)
            return;

        const startTime = startTimeRef.current.value;
        if (startTime.match("[0-9]{2}:[0-9]{2}:[0-9]{2}") === null) {
            console.log("Invalid start time");
            return;
        }
        const startTimeComponents = startTime.split(":").map(numStr => parseInt(numStr));
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setHours(startTimeComponents[0]);
        startDate.setMinutes(startTimeComponents[1]);
        startDate.setSeconds(startTimeComponents[2]);

        const endTime = endTimeRef.current.value;
        if (endTime.match("[0-9]{2}:[0-9]{2}:[0-9]{2}") === null) {
            console.log("Invalid end time");
            return;
        }
        const endTimeComponents = endTime.split(":").map(numStr => parseInt(numStr));
        const endDate = new Date();
        endDate.setHours(0, 0, 0, 0);
        endDate.setHours(endTimeComponents[0]);
        endDate.setMinutes(endTimeComponents[1]);
        endDate.setSeconds(endTimeComponents[2]);

        if (startDate.getTime() > endDate.getTime())
            return;

        dispatch(manualRecordAdded({
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
            tag: tagRef.current.value
        }));
    }

    return (
        <div>
            <input ref={startTimeRef} placeholder="start" />
            <input ref={endTimeRef} placeholder="end" />
            <input ref={tagRef} placeholder="tag" />
            <button onClick={handleClick}>add</button>
        </div>
    );
}

type TagSummaryProps = {
    records: {
        [key: number]: LapRecord,
    }
}

function TagSummary(props: TagSummaryProps) {
    const totalTime = Object.values(props.records).reduce<Record<string, number>>(
        (accumulator, currentValue) => {
            var val = 0;
            if (accumulator[currentValue.tag] !== undefined)
                val = accumulator[currentValue.tag];
            accumulator[currentValue.tag] = val + (currentValue.endTime - currentValue.startTime);
            return accumulator;
        },
        {}
    );

    const summary = Object.entries(totalTime).map(([tag, totalMs]) => (
        <p key={tag}>
            {tag} | {printTimeComponent(totalMs, "UTC")}
        </p>
    ));


    return (
        <div>
            {summary}
        </div>
    );
}

type DailyRecordProps = {
    records: {
        [key: number]: LapRecord
    }
}

function DailyRecordEntries(props: DailyRecordProps) {
    const dailyRecords = Object.values(props.records).map((lapRecord) => {
        var startDatetimeString = printTimeComponent(lapRecord.startTime);
        var endDatetimeString = printTimeComponent(lapRecord.endTime);
        return (
            <p key={lapRecord.lap}>
                {startDatetimeString} | {endDatetimeString} | {lapRecord.tag}
            </p>
        );
    })

    return (
        <div>
            {dailyRecords}
        </div>
    )
}

export default function DailyRecords() {
    const stateRecords = useSelector(selectRecords);

    return (
        <div>
            <ManualRecord />
            <TagSummary records={stateRecords.records} />
            <DailyRecordEntries records={stateRecords.records} />
        </div>
    );
}
