import React, { useState, useEffect, createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AppDispatch } from "store";
import { Tag } from "features/tag";

import { modifyRecord, manualRecordAdded, deleteRecord } from "../store/recordsSlice";
import { LapRecord, Records } from "../types/records";
import { printTimeComponent } from "../lib/dateParsing"
import { selectRecords } from "../store";

import "./styles.css";


type tagRecordEntryProps = {
    lapRecord: LapRecord,
    firstRecordData?: {
        totalTime: number, 
        rowSpan: number
    }
}
const ShowDeleteContext = createContext<React.Dispatch<React.SetStateAction<string[]>>>(
    () => {}
);


function TagRecordEntry(props: tagRecordEntryProps) {
    const dispatch: AppDispatch = useDispatch();
    const [editing, setEditing] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);
    const setSelectedRecords = useContext(ShowDeleteContext);
    const { 
        lapRecord, 
        firstRecordData
    } = props;
    const [startTime, setStartTime] = useState<Date>(new Date(lapRecord.startTime));
    const [endTime, setEndTime] = useState<Date>(new Date(lapRecord.endTime));
    const [tag, setTag] = useState<string>(lapRecord.tag);

    useEffect(() => {
        if (editing === true) {
            setSelected(false);
        }
    }, [editing])

    useEffect(() => {
        if (selected === false) {
            setSelectedRecords((curr) => {
                return curr.filter(lapId => lapId !== lapRecord.id );
            })
        } else {
            setSelectedRecords((curr) => {
                if (curr.includes(lapRecord.id)) {
                    return curr;
                }
                curr.push(lapRecord.id);
                return [...curr];
            })
        }
    }, [selected])

    function changeStartTime(newValue: Date | null) {
        if (newValue === null || isNaN(newValue.getTime())) {
            return;
        }
        setStartTime(newValue);
    }

    const changeEndTime = (newValue: Date | null) => {
        if (newValue === null || isNaN(newValue.getTime())) {
            return;
        }
        const startDay = new Date(startTime);
        startDay.setHours(0,0,0,0);
        const newValueDay = new Date(newValue);
        newValueDay.setHours(0,0,0,0);
        newValue = new Date(
            startDay.getTime() + (newValue.getTime() - newValueDay.getTime())
        );
        if (newValue.getTime() < startTime.getTime()) {
            newValue = new Date(newValue.getTime() + 1000*60*60*24);
        }
        setEndTime(newValue);
    }

    function confirmEdit(e: React.MouseEvent) {
        dispatch(modifyRecord({
            ...lapRecord, 
            tag, 
            startTime: startTime.getTime(), 
            endTime: endTime.getTime(),
        }))
        setEditing(false);
        e.stopPropagation();
    }

    return (
        <TableRow 
            className={`dr-body-record-row ${selected ? "dr-body-record-row-selected":""}`}
            onClick={() => {
                if (editing === false) {
                    setSelected((curr) => !curr)
                }
            }}
        >
            <TableCell 
                align="left" 
            >
                {editing ? 
                    <button 
                        className="dr-table-button dr-table-button-accent-green"
                        onClick={confirmEdit}
                    >
                        <CheckOutlinedIcon fontSize="small"/>
                    </button>:
                    <button 
                        className="dr-table-button"
                        onClick={(e) => {
                            setEditing(true);
                            e.stopPropagation();
                        }}
                    >
                        <EditOutlinedIcon fontSize="small"/>
                    </button>
                }
            </TableCell>
            <TableCell 
                align="left"
                className="dr-table-tag-column"
            >
                {editing ? 
                    <Tag 
                        value={tag}
                        onTagChange={(tag) => setTag(tag)}
                    />:
                    <p className="dr-cell-display-tag">
                        {lapRecord.tag}
                    </p>
                }
            </TableCell>
            <TableCell 
                align="right"
                className="dr-table-time-column"
            >
                {editing ? 
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimeField
                            label="Start"
                            format="HH:mm:ss"
                            size="small"
                            defaultValue={new Date(lapRecord.startTime)}
                            value={startTime}
                            onChange={changeStartTime}
                        />
                    </LocalizationProvider>:
                    <p>
                        {printTimeComponent(lapRecord.startTime)}
                    </p>
                }
            </TableCell>
            <TableCell 
                align="right"
                className="dr-table-time-column"
            >
                {editing ? 
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimeField
                            label="End"
                            format="HH:mm:ss"
                            size="small"
                            defaultValue={new Date(lapRecord.startTime)}
                            value={endTime}
                            onChange={changeEndTime}
                        />
                    </LocalizationProvider>:
                    <p>
                        {printTimeComponent(lapRecord.endTime)}
                    </p>
                }
            </TableCell>
            <TableCell 
                align="right"
            >
                {editing? 
                    printTimeComponent(endTime.getTime() - startTime.getTime(), "UTC"):
                    printTimeComponent(lapRecord.endTime - lapRecord.startTime, "UTC")
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
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
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

    const handleDelete = () => {
        for (const recordId of selectedRecords) {
            dispatch(deleteRecord(recordId));
        }
        setSelectedRecords([]);
    }

    return (
        <div>
            <ShowDeleteContext.Provider value={setSelectedRecords}>
                <TableContainer className="dr-table-container">
                    <Table sx={{ minWidth: "500px" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">
                                    {selectedRecords.length > 0 ? 
                                        <button
                                            className="dr-table-button dr-table-button-accent-red"
                                            onClick={handleDelete}
                                        >
                                            <DeleteOutlineIcon fontSize="small"/>
                                        </button>:
                                        <button
                                            className="dr-table-button"
                                            onClick={handleAdd}
                                        >
                                            <AddIcon fontSize="small"/>
                                        </button> 
                                    }
                                </TableCell>
                                <TableCell 
                                    align="center"
                                    className="dr-table-tag-column"
                                >
                                    Tag
                                </TableCell>
                                <TableCell 
                                    align="center" 
                                    className="dr-table-time-column"
                                >
                                    Start Time
                                </TableCell>
                                <TableCell 
                                    align="center" 
                                    className="dr-table-time-column"
                                >
                                    End Time
                                </TableCell>
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
            </ShowDeleteContext.Provider>
        </div>
    );
}
