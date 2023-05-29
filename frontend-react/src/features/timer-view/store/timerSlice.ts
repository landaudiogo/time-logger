import { RootState } from "store";
import { createSlice } from "@reduxjs/toolkit";

type TimerType = {
    duration: number;
}

const initialState: TimerType = {
    duration: 1000*60*25,
}

const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        timerDurationAdded(timer, action) {
            timer.duration = action.payload.duration;
        },
    }
});

const selectTimer = (state: RootState): TimerType => state.timer;

export default timerSlice.reducer;

export const { timerDurationAdded } = timerSlice.actions;
export { selectTimer };
