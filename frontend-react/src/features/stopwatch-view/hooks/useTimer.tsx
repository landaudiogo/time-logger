import { useState, useRef } from "react";
import { LapRecord } from "../types"


export function useElapsedTime(setRecord: React.Dispatch<React.SetStateAction<LapRecord | null>>) {
    const startTime = useRef<number | null>(null);
    const currentTimer = useRef<NodeJS.Timer | null>(null);
    const [lapCount, setLapCount] = useState(0);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [tag, setTag] = useState<string>("");

    function handleTimerEvent() {
        const now = Date.now();
        if (!startTime.current)
            throw new Error("startTime cannot be falsy when handling timer event.")
        setElapsedTime(now - startTime.current);
    }

    function handleStart() {
        if (startTime.current || currentTimer.current)
            return;
        startTime.current = Date.now();
        currentTimer.current = setInterval(handleTimerEvent, 1000);
    }

    function handleTagInput(e: React.FormEvent<HTMLInputElement>) {
        setTag(e.currentTarget.value)
    }

    function handleStop() {
        if (!currentTimer.current || !startTime.current)
            return;
        setElapsedTime(0);
        clearInterval(currentTimer.current);
        setRecord({
            lap: lapCount,
            start: startTime.current,
            end: Date.now(),
            tag: tag
        });
        setLapCount(curr => curr + 1);
        startTime.current = null;
        currentTimer.current = null;
    }

    return { elapsedTime, handleStop, handleStart, handleTagInput };
}
