import { LapRecord } from "features/stopwatch-view";
import { DataPoint } from "../types";


export function recordsCumulativeDataPoints(records: LapRecord[]): DataPoint[] {
    const dataPoints: DataPoint[] = [];
    const mergedRecords = mergeDataPoints(records);

    for (const record of mergedRecords) {
        if (dataPoints.length === 0) {
            dataPoints.push({
                x: record.startTime, 
                y: 0,
            })
            dataPoints.push({
                x: record.endTime, 
                y: record.endTime - record.startTime 
            })
            continue
        }

        const lastDataPoint = dataPoints[dataPoints.length - 1];
        dataPoints.push({
            x: record.startTime, 
            y: lastDataPoint.y
        })
        dataPoints.push({
            x: record.endTime, 
            y: lastDataPoint.y + (record.endTime - record.startTime)
        })
    }
    return dataPoints;
}

function mergeDataPoints(records: LapRecord[]): LapRecord[] { 
    records.sort((a,b) => a.startTime > b.startTime ? 1 : -1); 

    const dataPoints: LapRecord[] = [];
    for (const record of records) {
        if (dataPoints.length === 0) {
            dataPoints.push({...record});
            continue;
        }
        const lastDataPoint = dataPoints[dataPoints.length - 1];
        if (record.startTime < lastDataPoint.endTime
            && record.endTime > lastDataPoint.endTime
        ) { 
            lastDataPoint.endTime = record.endTime;
        } else if (
            record.startTime < lastDataPoint.endTime
            && record.endTime <= lastDataPoint.endTime
        ) { 
            continue
        } else { 
            dataPoints.push(record);
        }
    }
    return dataPoints;
}
