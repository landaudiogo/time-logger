import React, { useRef } from "react";
import Plot from 'react-plotly.js';

import { uuid } from "lib";
import { 
    printDateComponent, loadRecordsFromLocalStorage, recordsStorageToState,
} from "features/stopwatch-view";

import "./styles.css";


type DailySunburstProps = {
    day: Date
}

export default function DailySunburst(props: DailySunburstProps) {
    const day = props.day;
    const uid = uuid();

    const offsetDay = day;
    offsetDay.setHours(0, 0, 0, 0);

    const data = [{
        "type": "sunburst" as const,
        "ids": [] as string[],
        "labels": [] as string[],
        "parents": [] as string[],
        "values": [] as number[],
        "leaf": { "opacity": 0.4 },
        "marker": { "line": { "width": 2 } },
        "branchvalues": 'total' as const,
    }];
    const layout = {
        margin: { l: 4, r: 4, b: 4, t: 4 },
        width: 300, height: 300,
        paper_bgcolor: "hsl(207, 22%, 90%)",
    };

    const storageObject = loadRecordsFromLocalStorage(day);
    const records = Object.values(recordsStorageToState(storageObject));

    const tagLevelCumulative = {} as { [key: string]: number };
    for (const record of Object.values(records)) {
        const tagLevels = record.tag.split("/");
        for (const [i, level] of tagLevels.entries()) {
            const tagString = tagLevels.slice(0, i + 1).join("/");
            if (tagLevelCumulative[tagString] === undefined) {
                tagLevelCumulative[tagString] = 0;
            }
            const tmpVal = (record.endTime - record.startTime) / (1000 * 60 * 60);
            tagLevelCumulative[tagString] += Math.round(tmpVal * 100) / 100;
        }
    }

    var tagTotalTime = 0;
    for (const [tag, totalTime] of Object.entries(tagLevelCumulative)) {
        const tagTree = tag.split("/");
        let parent = tagTree.slice(0, tagTree.length - 1).join("/");
        if (parent === "") {
            parent = "total_" + uid;
            tagTotalTime += totalTime;
        }
        data[0].parents.push(parent);
        data[0].ids.push(tag);
        data[0].labels.push(tagTree[tagTree.length - 1]);
        data[0].values.push(totalTime);
    }
    data[0].labels.push("total");
    data[0].ids.push("total_" + uid);
    data[0].parents.push("");
    data[0].values.push(tagTotalTime);

    return (
        <div className="st-sunburst-plot">
            <h2 className="st-sunburst-plot-title">
                Day
            </h2>
            <h4 className="st-sunburst-plot-title">
                {printDateComponent(offsetDay.getTime())}
            </h4>
            {data[0].values.length === 1 ?
                <div
                    style={{
                        width: 300,
                        height: 300,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p>No Data</p>
                </div> :
                <Plot
                    data={data}
                    layout={layout}
                    config={{ modeBarButtonsToRemove: ['toImage'] }}
                />
            }
        </div>
    );
}
