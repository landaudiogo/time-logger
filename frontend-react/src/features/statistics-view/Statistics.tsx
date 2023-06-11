import React, { useState } from "react";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Cumulative from "./Cumulative";
import Sunburst from "./Sunburst";

export default function Statistics() {
    const [day, setDay] = useState(new Date());

    return (
        <div className="st-page">
            <div className="date-picker-container">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Pick Day"
                        value={day}
                        onChange={(newValue) => {
                            if (newValue !== null) {
                                setDay(newValue);
                            }
                        }}
                    />
                </LocalizationProvider>
            </div>
            <Cumulative day={day}/>
            <Sunburst day={day}/>
        </div>
    );

}
