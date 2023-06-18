import React, { useRef } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend, 
} from 'chart.js';
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { 
    printDateComponent, loadRecordsFromLocalStorage, recordsStorageToState,
} from "features/stopwatch-view";

import { getPersistedDays } from "lib/localstorage";

import "./styles.css";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);


type BarplotProps = {
    day: Date,
    setDay: React.Dispatch<React.SetStateAction<Date>>
}

export default function Barplot(props: BarplotProps) {
    const setDay = props.setDay;
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: "Week Summary",
                color: "hsl(206, 44%, 22%)",
                font: {
                    size: 24,
                    weight: "normal",
                }
            },
            annotation: {},
        },
    };

    const chartRef = useRef<ChartJS<"bar", number[], string>>();
    const day = props.day;

    const offsetDay = day;
    offsetDay.setHours(0,0,0,0);
    const mondayBeforeOffset = new Date(offsetDay.getTime() - (offsetDay.getDay() + 6) % 7*24*60*60*1000);
    const mondayAfterOffset = new Date(mondayBeforeOffset.getTime() + 7*24*60*60*1000);
    const allDays = [...Array(7).keys()].reduce(
        (acc, offset) => {
            const weekDay = new Date(mondayBeforeOffset.getTime() + offset*24*60*60*1000);
            acc[printDateComponent(weekDay.getTime())] = 0;
            return acc;
        },
        {} as {[key: string]: number}
    )

    const days = getPersistedDays().map((key) => new Date(key));
    const sinceMonday = days.filter((day) => {
        if (day >= mondayBeforeOffset && day < mondayAfterOffset) {
            return day
        }
    })
    sinceMonday.sort((a, b) => (a > b) ? 1 : -1);

    for (const day of sinceMonday) {
        const dateComponent = printDateComponent(day.getTime());
        const storageObject = loadRecordsFromLocalStorage(day);
        const records = Object.values(recordsStorageToState(storageObject));
        for (const record of records) {
            allDays[dateComponent] = allDays[dateComponent] + (record.endTime - record.startTime)/(60*60*1000);
        }
    }
    const data = {
        labels: Object.keys(allDays),
        datasets: [
            {
                label: "Total Time",
                data: Object.values(allDays),
                backgroundColor: "hsl(206, 78%, 81%)",
                hoverBackgroundColor: "hsl(206, 78%, 85%)",
                borderColor: "hsl(206, 44%, 22%)",
                borderWidth: 1,
                borderRadius: 5
            },
        ],
    };
    const weeklyTotal = Object.values(allDays).reduce((acc, dayTotal) => acc + dayTotal, 0);
    const weeklyAverage = weeklyTotal/7;
    options.plugins.annotation = {
        annotations: {
            line1: {
                type: "line",
                yMin: weeklyAverage,
                yMax: weeklyAverage,
                borderWidth: 2,
                borderColor: "hsl(207, 62%, 27%)",
                label: {
                    display: true,
                    content: `Average: ${weeklyAverage.toFixed(2)}`,
                    position: "middle",
                    backgroundColor: "hsl(207, 62%, 27%)",
                }

            }
        }
    }

    return (
        <div className="st-chart-container">
            <Bar
                ref={chartRef}
                className="st-canvas"
                options={options}
                data={data}
                onClick={(event) => {
                    if (chartRef.current === undefined) 
                        return;
                    const element = getElementAtEvent(chartRef.current, event);
                    if (element.length === 0) {
                        return;
                    }
                    const dataIndex = element[0].index;
                    setDay(new Date(data.labels[dataIndex]));
                }}
            />
        </div>
    );
}
