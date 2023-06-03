import React from "react";
import { useSelector } from "react-redux";
import { selectRecords } from "../stopwatch-view";
import Plot from 'react-plotly.js';
import "./styles.css";


export default function DailySunburst() { 
    const data = [{
        "type": "sunburst" as const,
        "labels": [] as string[],
        "parents": [] as string[],
        "values":  [] as number[],
        "leaf": {"opacity": 0.4},
        "marker": {"line": {"width": 2}},
        "branchvalues": 'total' as const,
    }];

    const records = useSelector(selectRecords);
    const tagLevelCumulative = {} as {[key: number]: {[key: string]: number}};
    for (const record of Object.values(records.records)) {
        const tagLevels = record.tag.split("/");
        for (const [i, level] of tagLevels.entries()) {
            if (tagLevelCumulative[i] === undefined) {
                tagLevelCumulative[i] = {};
            }
            const tagString = tagLevels.slice(0, i+1).join("/");
            if (tagLevelCumulative[i][tagString] === undefined) {
                tagLevelCumulative[i][tagString] = 0;
            }
            const tmpVal = (record.endTime - record.startTime)/(1000*60*60);
            tagLevelCumulative[i][tagString] += Math.round(tmpVal*100)/100;
        }
    }

    var tagTotalTime = 0;
    for (const [level, tagTimes] of Object.entries(tagLevelCumulative)) {
        for (const [tag, totalTime] of Object.entries(tagTimes)) {
            const tagTree = tag.split("/");
            var parent = tagTree.slice(0, tagTree.length-1).join("/");
            data[0].labels.push(tag);
            if (parent === "") {
                parent = "total";
                tagTotalTime += totalTime;
            }
            data[0].parents.push(parent);
            data[0].values.push(totalTime);
        }

    }
    data[0].labels.push("total");
    data[0].parents.push("");
    data[0].values.push(tagTotalTime);

    const layout1 = {
        margin: {l: 4, r: 4, b: 4, t: 4},
        width: 300, height: 300,
        paper_bgcolor: "hsl(207, 22%, 90%)",
    };

    return (
        <div className="st-sunburst-plot">
            <h2 className="st-sunburst-plot-title">Daily Shares</h2>
            <Plot
                data={data}
                layout={layout1}
                config={{modeBarButtonsToRemove: ['toImage']}}
            />
        </div>
    );
}
