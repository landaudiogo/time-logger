import React from "react";
import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useSelector } from "react-redux";

import { selectRecords } from "features/stopwatch-view";
import { uuid } from "lib";
import { LapRecord } from "features/stopwatch-view";
import {
    loadRecordsFromLocalStorage, recordsStorageToState,
} from "features/stopwatch-view";

import { recordsCumulativeDataPoints } from "./lib/dataProcessing";
import "./styles.css";


ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

type CumulativeProps = {
    day: Date
}

export default function Cumulative(props: CumulativeProps) {
    const options = {
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                    color: "hsl(206, 44%, 22%)",
                }
            },
            title: {
                display: true,
                text: "Cumulative Time",
                color: "hsl(206, 44%, 22%)",
                font: {
                    size: 24,
                    weight: "normal",
                }
            },
        },
        scales: {
            x: {
                type: "time" as const,
                min: 0,
                ticks: {
                    stepSize: 60,
                    color: "hsl(206, 44%, 22%)",
                },
                time: {
                    unit: "minute" as const,
                    displayFormats: {
                        "minute": "HH:mm" as const,
                    }
                },
                grid: {
                    color: "transparent",
                }
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 1,
                    color: "hsl(206, 44%, 22%)",
                },
            },
        }
    };
    const day = props.day;
    const uid = uuid();

    const storageObject = loadRecordsFromLocalStorage(day);
    const stateRecords = Object.values(recordsStorageToState(storageObject));

    let xMin: null | number = null;
    const tagRecords = Object.values(stateRecords).reduce(
        (acc, record) => {
            if (acc[record.tag] === undefined) {
                acc[record.tag] = [];
            }
            if (xMin === null || xMin > record.startTime) {
                const start = new Date(record.startTime);
                start.setMinutes(0);
                xMin = start.getTime();
            }
            acc[record.tag].push({...record});
            return acc;
        },
        {} as { [key: string]: Array<LapRecord> }
    )
    options.scales.x.min = xMin !== null ? xMin : day.getTime();
    tagRecords[`total_${uid}`] = [...Object.values(stateRecords)];

    const tagDataPoints = Object.entries(tagRecords).reduce(
        (acc, [tag, records]) => {
            acc[tag] = recordsCumulativeDataPoints(records);
            return acc; 
        }, 
        { } as { [key: string]: Array<{x: number, y:number}>}
    )

    const data = {
        datasets: Object.entries(tagDataPoints).map(([tag, cumulativeArray], index) => {
            const increment = 255 / (Object.keys(tagDataPoints).length + 1);
            var borderColor: string;
            var backgroundColor: string;
            var label: string;
            if (tag !== `total_${uid}`) {
                borderColor = `hsl(${increment * (index + 1)}, 70%, 50%)`;
                backgroundColor = `hsl(${increment * (index + 1)}, 70%, 70%)`;
                label = tag;
            } else {
                borderColor = "hsl(207, 64%, 38%, 20%)";
                backgroundColor = "hsl(207, 64%, 58%, 20%)";
                label = "total";
            }
            return {
                label: label,
                data: cumulativeArray.map(({x, y}) => ({x: x, y: y/(1000*60*60)})),
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }
        })
    }

    return (
        <div className="st-chart-container">
            <Line className="st-canvas" options={options} data={data} />
        </div>
    );
}
