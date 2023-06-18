import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { AppDispatch } from "store";
import { 
    DailyRecords, loadRecordsFromLocalStorage, recordsStorageToState, 
    recordsAdded
} from "features/stopwatch-view";

import Cumulative from "./Cumulative";
import Sunburst from "./Sunburst";
import Barplot from "./Barplot";

export default function Statistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [day, setDay] = useState(today);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const storageObject = loadRecordsFromLocalStorage(day);
        const records = recordsStorageToState(storageObject);
        dispatch(recordsAdded({ records }));
    }, [day])

    return (
        <div className="st-page">
            <div className="date-picker-container">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Pick Day"
                        value={day}
                        format="dd/MM/yyyy"
                        onChange={(newValue) => {
                            if (newValue !== null) {
                                setDay(newValue);
                            }
                        }}
                    />
                </LocalizationProvider>
            </div>
            <Barplot day={day}/>
            <Cumulative day={day}/>
            <Sunburst day={day}/>
            <DailyRecords day={day} />
        </div>
    );

}
