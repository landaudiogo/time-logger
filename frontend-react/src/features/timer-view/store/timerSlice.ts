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

const timerReducer = timerSlice.reducer;
const timerRootReducer: typeof timerReducer = (state, action) => {
    if (action.type === "concurrent/timer") {
        console.log(action.type);
        return timerReducer(action.payload, action);
    }
    return timerReducer(state, action);
}

const selectTimer = (state: RootState): TimerT => state.timer;

export function timerDurationAdded(payload: {duration: number}) { 
    
    return (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(timerSlice.actions.timerDurationAdded(payload))
        const timer = selectTimer(getState());
        timerToLocalStorage(timer);
    }
}


export default timerRootReducer;

export { selectTimer };
