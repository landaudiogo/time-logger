import React, { useState } from "react";
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
import "./styles.css";


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
        <TableRow>
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
            <TagRecordEntry 
                key={lapRecord.tag+lapRecord.startTime.toString()} 
                lapRecord={lapRecord} />: 
            <TagRecordEntry 
                key={lapRecord.tag+lapRecord.startTime.toString()} 
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
    const dispatch = useDispatch();

    const tagRecords: TagRecords = {};
    var totalTime = 0;
    for (const lapRecord of Object.values(stateRecords.records)) {
        if (tagRecords[lapRecord.tag] === undefined) {
            tagRecords[lapRecord.tag] = [];
        }
        tagRecords[lapRecord.tag].push(lapRecord)
        totalTime = totalTime + lapRecord.endTime - lapRecord.startTime;
    }

    function handleAdd() {
        dispatch(manualRecordAdded({
            startTime: new Date().getTime(),
            endTime: new Date().getTime(),
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
                            <TableCell align="right">Start Time</TableCell>
                            <TableCell align="right">End Time</TableCell>
                            <TableCell align="right">Total Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(tagRecords).map((key) => tagRecordsRows(tagRecords[key]))}
                        <TableRow>
                            <TableCell colSpan={4} align="right">
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
