import { isLeft } from "fp-ts/Either";
import { TimerT, TimerStorageIO, TimerStorage } from "../types";


const defaultTimer: TimerT = {
    duration: 1000*60*25
}
const timerStorageKey = "timer";


export function loadTimerFromLocalStorage(): TimerStorage | null {
    const timerJSON = localStorage.getItem(timerStorageKey);
    if (timerJSON === null || timerJSON === "") {
        return null;
    }
    let timerObject = {};
    try {
        timerObject = JSON.parse(timerJSON);
    } catch (error) { }

    const decoded = TimerStorageIO.decode(timerObject);
    if (isLeft(decoded)) {
        console.log("Could not decode");
        return null;
    }
    const decodedTagsStorage: TimerStorage = decoded.right;
    return decodedTagsStorage;
}

export function timerStorageToState(
    timerStorage: TimerStorage | null, 
    defaultValue: TimerT = defaultTimer,
): TimerT {
    return timerStorage === null ? {...defaultValue} : timerStorage.timer;
}

export function timerToLocalStorage(timer: TimerT) {
    const timerStorage = {
        version: "v1",
        timer: timer,
    };
    localStorage.setItem(timerStorageKey, JSON.stringify(timerStorage));
}
