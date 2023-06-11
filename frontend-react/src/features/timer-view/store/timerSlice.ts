import { RootState, AppDispatch } from "store";
import { createSlice } from "@reduxjs/toolkit";

import { TimerT } from "../types";
import { 
    loadTimerFromLocalStorage, timerToLocalStorage, timerStorageToState 
} from "../lib/storage";


const timerStorage = loadTimerFromLocalStorage();
const initialState = timerStorageToState(timerStorage);

const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        timerDurationAdded(timer, action) {
            timer.duration = action.payload.duration;
        },
    }
});

const selectTimer = (state: RootState): TimerT => state.timer;

export function timerDurationAdded(payload: {duration: number}) { 
    
    return (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(timerSlice.actions.timerDurationAdded(payload))
        const timer = selectTimer(getState());
        timerToLocalStorage(timer);
    }
}


export default timerSlice.reducer;

export { selectTimer };
