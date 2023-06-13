import React, { useState, useRef } from "react";
import Plot from 'react-plotly.js';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getPersistedDays } from "lib/localstorage";
import { uuid } from "lib";
import { 
    validateDateInput, printDateComponent,
    loadRecordsFromLocalStorage, recordsStorageToState,
} from "features/stopwatch-view";

import { LapRecord } from "../stopwatch-view";
import "./styles.css";


type WeeklySunburstProps = {
    day: Date
}

export default function WeeklySunburst(props: WeeklySunburstProps) {
    const day = props.day;
    const inputRef = useRef<HTMLInputElement>(null);
    const uid = uuid();

    const offsetDay = day;
    offsetDay.setHours(0,0,0,0);
    const mondayBeforeOffset = new Date(offsetDay.getTime() - (offsetDay.getDay() + 6) % 7*24*60*60*1000);
    const mondayAfterOffset = new Date(mondayBeforeOffset.getTime() + 7*24*60*60*1000);

    const days = getPersistedDays().map((key) => new Date(key));
    const sinceMonday = days.filter((day) => {
        if (day >= mondayBeforeOffset && day < mondayAfterOffset) {
            return day
        }
    })
    sinceMonday.sort((a, b) => (a > b) ? 1 : -1);

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
    var records: LapRecord[] = [];

    for (const day of sinceMonday) {
        const storageObject = loadRecordsFromLocalStorage(day);
        const dayRecords = Object.values(recordsStorageToState(storageObject));
        records = [...records, ...dayRecords];
    }

    const tagLevelCumulative = {} as { [key: number]: { [key: string]: number } };
    for (const record of Object.values(records)) {
        const tagLevels = record.tag.split("/");
        for (const [i, level] of tagLevels.entries()) {
            if (tagLevelCumulative[i] === undefined) {
                tagLevelCumulative[i] = {};
            }
            const tagString = tagLevels.slice(0, i + 1).join("/");
            if (tagLevelCumulative[i][tagString] === undefined) {
                tagLevelCumulative[i][tagString] = 0;
            }
            const tmpVal = (record.endTime - record.startTime) / (1000 * 60 * 60);
            tagLevelCumulative[i][tagString] += Math.round(tmpVal * 100) / 100;
        }
    }

    var tagTotalTime = 0;
    for (const [level, tagTimes] of Object.entries(tagLevelCumulative)) {
        for (const [tag, totalTime] of Object.entries(tagTimes)) {
            const tagTree = tag.split("/");
            var parent = tagTree.slice(0, tagTree.length - 1).join("/");
            if (parent === "") {
                parent = "total_" + uid;
                tagTotalTime += totalTime;
            }
            data[0].labels.push(tag === "" ? "no-tag" : tagTree[tagTree.length-1])
            data[0].parents.push(parent);
            data[0].ids.push(tag);
            data[0].values.push(totalTime);
        }

    }
    data[0].labels.push("total");
    data[0].ids.push("total_" + uid);
    data[0].parents.push("");
    data[0].values.push(tagTotalTime);

    const layout1 = {
        margin: { l: 4, r: 4, b: 4, t: 4 },
        width: 300, height: 300,
        paper_bgcolor: "hsl(207, 22%, 90%)",
    };
    function monthDay(date: string) {
        return date.split("/").slice(1).join("/");
    }

    return (
        <div className="st-sunburst-plot">
            <h2 className="st-sunburst-plot-title">
                Week
            </h2>
            <h4 className="st-sunburst-plot-title">
                {monthDay(printDateComponent(mondayBeforeOffset.getTime()))}
                {" - "}
                {monthDay(printDateComponent(mondayAfterOffset.getTime()-24*60*60*1000))}
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
                </div>:
                <Plot
                    data={data}
                    layout={layout1}
                    config={{ modeBarButtonsToRemove: ['toImage'] }}
                />
            }
        </div>
    );
}
