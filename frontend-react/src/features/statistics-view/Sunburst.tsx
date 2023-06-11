import React from "react";
import DailySunburst from "./DailySunburst";
import WeeklySunburst from "./WeeklySunburst";

type SunburstProps = {
    day: Date
}

export default function Sunburst(props: SunburstProps) {
    return (
        <div className="st-chart-container">
            <div 
                className="st-sunburst-wrap"
            >
                <DailySunburst day={props.day}/>
                <WeeklySunburst day={props.day}/>
            </div>
        </div>
    )
}
