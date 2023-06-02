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
import { useSelector } from "react-redux";
import { selectRecords } from "features/stopwatch-view";
import 'chartjs-adapter-date-fns';
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

export const options = {
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

export default function Statistics() {
    const records = useSelector(selectRecords);
    var minStartTime: number;
    const tagCumulative = Object.values(records.records).reduce(
        (acc, record) => {
            if (acc[record.tag] === undefined) {
                acc[record.tag] = [];
            }
            if (options.scales.x.min === 0 || record.startTime < options.scales.x.min) {
                options.scales.x.min = Math.floor(record.startTime/(1000*60*60))*1000*60*60; 
            }
            const tagArray = acc[record.tag];
            if (tagArray.length === 0) {
                tagArray.push({
                    x: record.startTime,
                    y: 0,
                });
                tagArray.push({
                    x: record.endTime,
                    y: (record.endTime - record.startTime)/(1000*60*60),
                });
            } else {
                const tagLastElement = tagArray[tagArray.length - 1];
                tagArray.push({
                    x: record.startTime,
                    y: tagLastElement.y,
                })
                tagArray.push({
                    x: record.endTime,
                    y: tagLastElement.y + (record.endTime - record.startTime)/(1000*60*60)
                })
            }
            
            const totalArray = acc["total"];
            if (totalArray.length === 0) {
                totalArray.push({
                    x: record.startTime,
                    y: 0,
                });
                totalArray.push({
                    x: record.endTime,
                    y: (record.endTime - record.startTime)/(1000*60*60),
                });
            } else {
                const totalLastElement = totalArray[totalArray.length - 1];
                totalArray.push({
                    x: record.startTime,
                    y: totalLastElement.y,
                })
                totalArray.push({
                    x: record.endTime,
                    y: totalLastElement.y + (record.endTime - record.startTime)/(1000*60*60)
                })
            }
            return acc;
        }, 
        {total: []} as {[key: string]: Array<{x: number, y: number}>}
    )

    const data = {
        datasets: Object.entries(tagCumulative).map(([tag, cumulativeArray], index) => {
            const increment = 255/(Object.keys(tagCumulative).length + 1);
            var borderColor: string;
            var backgroundColor: string;
            if (tag !== "total") {
                borderColor = `hsl(${increment*(index + 1)}, 70%, 50%)`; 
                backgroundColor = `hsl(${increment*(index + 1)}, 70%, 70%)`;
            } else {
                borderColor = "hsl(207, 64%, 38%, 20%)";
                backgroundColor = "hsl(207, 64%, 58%, 20%)"
            }
            return {
                label: tag,
                data: cumulativeArray,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            }
        })
    }

    return (
        <div className="st-page">
            <div className="st-chart-container">
                <Line className="st-canvas" options={options} data={data} />
            </div>
        </div>
    );
}
