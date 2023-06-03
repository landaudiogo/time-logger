import React from "react";
import Cumulative from "./Cumulative";
import Sunburst from "./Sunburst";

export default function Statistics() {
    return (
        <div className="st-page">
            <Cumulative />
            <Sunburst />
        </div>
    );

}
