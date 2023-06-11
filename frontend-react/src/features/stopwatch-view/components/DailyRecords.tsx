import React, { useState } from "react";
import { printTimeComponent } from "../lib/dateParsing"
import { selectRecords } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { modifyRecord, manualRecordAdded, deleteRecord } from "../store/recordsSlice";
import { LapRecord, Records } from "../types/records";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "./styles.css";
import { AppDispatch } from "store";


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
    const dispatch: AppDispatch = useDispatch();
    const [editingTag, setEditingTag] = useState<boolean>(false);
    const [editingStartTime, setEditingStartTime] = useState<boolean>(false);
    const [editingEndTime, setEditingEndTime] = useState<boolean>(false);
    const { 
        lapRecord, 
        firstRecordData
    } = props;

    function editTag(value: string) { 
        const newRecord = {...lapRecord};
        newRecord.tag = value
        dispatch(modifyRecord(newRecord));
        setEditingTag(false);
    }
    function tagHandleKeyDown(e: React.KeyboardEvent) {
        if (e.key !== "Enter") 
            return;
        const target = e.target as HTMLInputElement;
        editTag(target.value);
    }

    function editStartTime(value: string) {
        const newRecord = {...lapRecord};
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
            console.log("Start time cannot be bigger than end time");
            return;
        }
        dispatch(modifyRecord(newRecord));
        setEditingStartTime(false);
    }

    function startHandleKeyDown(e: React.KeyboardEvent) {
        if (e.key !== "Enter") 
            return;
        const target = e.target as HTMLInputElement;
        const value = target.value; 
        editStartTime(value);
    }

    function editEndTime(value: string) {
        if (!validateTimeInput(value)) { 
            return
        }
        const newRecord = {...lapRecord};
        const timeComponents = value.split(":").map(numStr => parseInt(numStr));
        let date = new Date(lapRecord.startTime);
        date.setHours(0, 0, 0, 0);
        date.setHours(timeComponents[0]);
        date.setMinutes(timeComponents[1]);
        date.setSeconds(timeComponents[2]);
        if (newRecord.startTime > date.getTime()) {
            newRecord.endTime = date.getTime() + 1000*60*60*24;
        } else {
            newRecord.endTime = date.getTime();
        }
        dispatch(modifyRecord(newRecord));
        setEditingEndTime(false);
    }

    function endHandleKeyDown(e: React.KeyboardEvent) {
        if (e.key !== "Enter") 
            return;
        const target = e.target as HTMLInputElement;
        const value = target.value; 
        editEndTime(value);
    }

    function handleDelete() {
        dispatch(deleteRecord(lapRecord.id));
    }

    return (
        <TableRow>
            <TableCell 
                align="left" 
            >
                <button 
                    className="dr-table-button dr-table-button-accent-red"
                    onClick={handleDelete}
                >
                    &#128465;
                </button>
            </TableCell>
            <TableCell 
                align="center"
            >
                {editingTag ? 
                    <input 
                        className="dr-cell-editing dr-cell-tag-editing"
                        onKeyDown={tagHandleKeyDown}
                        defaultValue={lapRecord.tag}
                        onBlur={(e) => editTag(e.currentTarget.value)}
                        autoFocus
                    />:
                    <p
                        onClick={() => setEditingTag(true)}
                        className="dr-cell-display-tag"
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
                        onBlur={(e) => editStartTime(e.currentTarget.value)}
                        autoFocus
                    />:
                    <p
                        onClick={() => setEditingStartTime(true)}
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
                        onBlur={(e) => editEndTime(e.currentTarget.value)}
                        autoFocus
                    />:
                    <p
                        onClick={() => setEditingEndTime(true)}
                    >
                        {printTimeComponent(lapRecord.endTime)}
                    </p>
                }
            </TableCell>
            <TableCell 
                align="right"
            >
                {printTimeComponent(lapRecord.endTime - lapRecord.startTime, "UTC")}
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
    tagEntries.sort((a, b) => {
        return b.startTime - a.startTime;
    });

    const entries = tagEntries.map((lapRecord, index) => 
        (index !== 0) ? 
            <TagRecordEntry 
                key={lapRecord.id} 
                lapRecord={lapRecord} />: 
            <TagRecordEntry 
                key={lapRecord.id} 
                lapRecord={lapRecord} 
                firstRecordData={{ totalTime, rowSpan: tagEntries.length }}
            />
    );

    return entries;
}

type TagRecords = {
    [key: string]: Array<LapRecord>
}

type DailyRecordsProps = {
    day: Date,
};

export default function DailyRecords(props: DailyRecordsProps) {
    const day = props.day;
    const records = useSelector(selectRecords);
    const dispatch: AppDispatch = useDispatch();

    const stateRecords: Records = {};
    for (const record of Object.values(records)) { 
        if ((record.startTime >= day.getTime()) 
            && (record.startTime < (day.getTime() + 1000*60*60*24))
        ) {
            stateRecords[record.id] = record;
        }
    }

    const tagRecords: TagRecords = {};
    var totalTime = 0;
    for (const lapRecord of Object.values(stateRecords)) {
        if (tagRecords[lapRecord.tag] === undefined) {
            tagRecords[lapRecord.tag] = [];
        }
        tagRecords[lapRecord.tag].push(lapRecord)
        totalTime = totalTime + lapRecord.endTime - lapRecord.startTime;
    }

    function handleAdd() {
        dispatch(manualRecordAdded({
            startTime: day.getTime(),
            endTime: day.getTime()+1000*60*10,
            tag: ""
        }))
    }

    return (
        <div>
            <TableContainer className="dr-table-container">
                <Table sx={{ minWidth: "500px" }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <button
                                    className="dr-table-button"
                                    onClick={handleAdd}
                                >
                                    &#x2b;
                                </button>
                            </TableCell>
                            <TableCell align="center">Tag</TableCell>
                            <TableCell align="center">Start Time</TableCell>
                            <TableCell align="center">End Time</TableCell>
                            <TableCell align="center">Split</TableCell>
                            <TableCell align="center">Total Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(tagRecords).map((key) => tagRecordsRows(tagRecords[key]))}
                        <TableRow>
                            <TableCell colSpan={5} align="right">
                                <strong>Total Time:</strong>
                            </TableCell>
                            <TableCell align="right">
                                <strong>{printTimeComponent(totalTime, "UTC")}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
