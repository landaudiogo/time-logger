import React, { useRef, useState } from "react";
import { printTimeComponent } from "../lib/dateParsing"
import { selectRecords } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { LapRecord, modifyRecord, manualRecordAdded, deleteRecord } from "../store/recordsSlice";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
            <input ref={startTimeRef} placeholder="start" className="daily-record-time-input" />
            <input ref={endTimeRef} placeholder="end" className="daily-record-time-input" />
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
            <input ref={startRef} defaultValue={printTimeComponent(record.startTime)} className="time-input" />
            <input ref={endRef} defaultValue={printTimeComponent(record.endTime)} className="time-input" />
            <input ref={tagRef} defaultValue={record.tag} />
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
        dispatch(deleteRecord({ lap: lapRecord.lap }));
    }

    return (
        <div>
            <p key={lapRecord.lap} style={{ display: "inline" }}>
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

enum ModifiableLapRecordMembers {
    tag = "tag",
    startTime = "startTime",
    endTime = "endTime",
}

type tagRecordEntryProps = {
    lapRecord: LapRecord,
    firstRecordData?: {
        totalTime: number, 
        rowSpan: number
    }
}

function validateTimeInput(timeString: string) {
    if (timeString.match("[0-9]{2}:[0-9]{2}:[0-9]{2}") === null) {
        console.log("Invalid time string");
        return false;
    }
    return true;
}

function TagRecordEntry(props: tagRecordEntryProps) {
    const dispatch = useDispatch();
    const [editingTag, setEditingTag] = useState<boolean>(false);
    const [editingStartTime, setEditingStartTime] = useState<boolean>(false);
    const [editingEndTime, setEditingEndTime] = useState<boolean>(false);
    const { 
        lapRecord, 
        firstRecordData
    } = props;

    function tagHandleKeyDown(e: React.KeyboardEvent) {
        if (e.key !== "Enter") 
            return;
        const newRecord = {...lapRecord};
        const target = e.target as HTMLInputElement;
        newRecord.tag = target.value;
        dispatch(modifyRecord(newRecord));
        setEditingTag((curr) => !curr);
    }

    function startHandleKeyDown(e: React.KeyboardEvent) {
        if (e.key !== "Enter") 
            return;
        const newRecord = {...lapRecord};
        const target = e.target as HTMLInputElement;
        const value = target.value; 
        if (!validateTimeInput(value)) { 
            return
        }
        const timeComponents = value.split(":").map(numStr => parseInt(numStr));
        const date = new Date(lapRecord.startTime);
        date.setHours(0, 0, 0, 0);
        date.setHours(timeComponents[0]);
        date.setMinutes(timeComponents[1]);
        date.setSeconds(timeComponents[2]);
        newRecord.startTime = date.getTime();
        if (newRecord.startTime > newRecord.endTime) { 
            return;
        }
        dispatch(modifyRecord(newRecord));
        setEditingStartTime((curr) => !curr);
    }

    function endHandleKeyDown(e: React.KeyboardEvent) {
        if (e.key !== "Enter") 
            return;
        const newRecord = {...lapRecord};
        const target = e.target as HTMLInputElement;
        const value = target.value; 
        if (!validateTimeInput(value)) { 
            return
        }
        const timeComponents = value.split(":").map(numStr => parseInt(numStr));
        const date = new Date(lapRecord.startTime);
        date.setHours(0, 0, 0, 0);
        date.setHours(timeComponents[0]);
        date.setMinutes(timeComponents[1]);
        date.setSeconds(timeComponents[2]);
        newRecord.endTime = date.getTime();
        dispatch(modifyRecord(newRecord));
        setEditingEndTime((curr) => !curr);
    }

    function handleDelete() {
        dispatch(deleteRecord({ lap: lapRecord.lap }));
    }

    return (
        <TableRow 
            key={lapRecord.tag+lapRecord.startTime.toString()} 
        >
            <TableCell 
                align="left" 
                onClick={handleDelete}
            >
                <button className="dr-table-button dr-table-button-accent-red">&#128465;</button>
            </TableCell>
            <TableCell 
                align="center"
            >
                {editingTag ? 
                    <input 
                        className="dr-cell-editing dr-cell-tag-editing"
                        onKeyDown={tagHandleKeyDown}
                        defaultValue={lapRecord.tag}
                        onBlur={() => setEditingTag((curr) => !curr)}
                        autoFocus
                    />:
                    <p
                        onClick={() => setEditingTag((curr) => !curr)}
                    >
                        {lapRecord.tag}
                    </p>
                }
            </TableCell>
            <TableCell 
                align="right"
            >
                {editingStartTime ? 
                    <input 
                        className="dr-cell-editing dr-cell-time-editing"
                        onKeyDown={startHandleKeyDown}
                        defaultValue={printTimeComponent(lapRecord.startTime)}
                        onBlur={() => setEditingStartTime((curr) => !curr)}
                        autoFocus
                    />:
                    <p
                        onClick={() => setEditingStartTime((curr) => !curr)}
                    >
                        {printTimeComponent(lapRecord.startTime)}
                    </p>
                }
            </TableCell>
            <TableCell 
                align="right"
            >
                {editingEndTime ? 
                    <input 
                        className="dr-cell-editing dr-cell-time-editing"
                        onKeyDown={endHandleKeyDown}
                        defaultValue={printTimeComponent(lapRecord.endTime)}
                        onBlur={() => setEditingEndTime((curr) => !curr)}
                        autoFocus
                    />:
                    <p
                        onClick={() => setEditingEndTime((curr) => !curr)}
                    >
                        {printTimeComponent(lapRecord.endTime)}
                    </p>
                }
            </TableCell>
            {(firstRecordData !== undefined) &&
                <TableCell 
                    align="right" 
                    rowSpan={firstRecordData.rowSpan}
                >
                    <strong>{printTimeComponent(firstRecordData.totalTime, "UTC")}</strong>
                </TableCell>
            }
        </TableRow>
    )
}

function tagRecordsRows(tagEntries: Array<LapRecord>) {
    const totalTime = tagEntries.reduce(
        (acc, curr) => acc + (curr.endTime - curr.startTime),
        0
    );

    const entries = tagEntries.map((lapRecord, index) => 
        (index !== 0) ? 
            <TagRecordEntry lapRecord={lapRecord} />: 
            <TagRecordEntry 
                lapRecord={lapRecord} 
                firstRecordData={{ totalTime, rowSpan: tagEntries.length }}
            />
    );

    return entries;
}

type TagRecords = {
    [key: string]: Array<LapRecord>
}

export default function DailyRecords() {
    const stateRecords = useSelector(selectRecords);

    const tagRecords: TagRecords = {};
    for (const lapRecord of Object.values(stateRecords.records)) {
        if (tagRecords[lapRecord.tag] === undefined) {
            tagRecords[lapRecord.tag] = [];
        }
        tagRecords[lapRecord.tag].push(lapRecord)
    }
    console.log(tagRecords);
    console.log(stateRecords);

    return (
        <div>
            <TableContainer className="dr-table-container">
                <Table sx={{ minWidth: "500px" }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"><button className="dr-table-button">&#x2b;</button></TableCell>
                            <TableCell align="center">Tag</TableCell>
                            <TableCell align="right">Start Time</TableCell>
                            <TableCell align="right">End Time</TableCell>
                            <TableCell align="right">Total Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(tagRecords).map((key) => tagRecordsRows(tagRecords[key]))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
