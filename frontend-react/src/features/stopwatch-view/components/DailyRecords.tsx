import React, { useRef, useState } from "react";
import { printTimeComponent } from "../lib/dateParsing"
import { selectRecords } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { LapRecord, modifyRecord, manualRecordAdded, deleteRecord } from "../store/recordsSlice";
import "./styles.css";

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
            <input ref={startTimeRef} placeholder="start" className="daily-record-time-input"/>
            <input ref={endTimeRef} placeholder="end" className="daily-record-time-input"/>
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

type EditDailyRecordProps = {
    record: LapRecord,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

function EditDailyRecord(props: EditDailyRecordProps) {
    const { setIsEditing, record } = props;
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    function handleDone() { 
        if (startRef.current === null || endRef.current === null || tagRef.current === null)
            return;
        const startTime = startRef.current.value;
        const startTimeComponents = startTime.split(":").map(numStr => parseInt(numStr));
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setHours(startTimeComponents[0]);
        startDate.setMinutes(startTimeComponents[1]);
        startDate.setSeconds(startTimeComponents[2]);

        const endTime = endRef.current.value;
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
        dispatch(modifyRecord({
            ...record, 
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
            tag: tagRef.current.value,
        }));

        setIsEditing(false);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center"
            }}
        >
            <input ref={startRef} defaultValue={printTimeComponent(record.startTime)} className="time-input"/>
            <input ref={endRef} defaultValue={printTimeComponent(record.endTime)} className="time-input"/>
            <input ref={tagRef} defaultValue={record.tag}/>
            <button onClick={handleDone}>done</button>
        </div>
    );
}

type DailyRecordProps = {
    lapRecord: LapRecord
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
};

function DailyRecord(props: DailyRecordProps) {
    const { lapRecord, setIsEditing } = props;
    const dispatch = useDispatch();
    const startDatetimeString = printTimeComponent(lapRecord.startTime);
    const endDatetimeString = printTimeComponent(lapRecord.endTime);

    function handleDelete() { 
        dispatch(deleteRecord({lap: lapRecord.lap}));
    }

    return (
        <div>
            <p key={lapRecord.lap} style={{display: "inline"}}>
                {startDatetimeString} | {endDatetimeString} | {lapRecord.tag}
            </p>
            <button onClick={() => setIsEditing(true)}>edit</button>
            <button onClick={handleDelete}>delete</button>
        </div>
    );

}

type DisplayDailyRecordProps = {
    lapRecord: LapRecord,
};

function DisplayDailyRecord(props: DisplayDailyRecordProps) {
    const { lapRecord } = props;
    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        isEditing ?
            <EditDailyRecord record={lapRecord} setIsEditing={setIsEditing} /> :
            <DailyRecord lapRecord={lapRecord} setIsEditing={setIsEditing} />
    );
}

type DailyRecordsEntriesProps = {
    records: {
        [key: number]: LapRecord
    }
};


function DailyRecordEntries(props: DailyRecordsEntriesProps) {
    const dailyRecords = Object.values(props.records).map((lapRecord) => {
        return (
            <DisplayDailyRecord key={lapRecord.lap} lapRecord={lapRecord} />
        );
    });

    return (
        <div>
            {dailyRecords}
        </div>
    );
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
