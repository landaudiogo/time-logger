import React from "react";
import DailySunburst from "./DailySunburst";
import WeeklySunburst from "./WeeklySunburst";

export default function Sunburst() {
    return (
        <div className="st-chart-container">
            <div 
                className="st-sunburst-wrap"
            >
                <DailySunburst />
                <WeeklySunburst />
            </div>
        </div>
    )
}
