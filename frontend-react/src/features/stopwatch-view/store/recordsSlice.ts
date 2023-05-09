import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

type LapRecord = {
    
}

type RecordsType = {
    records: Array<LapRecord>,
}

const initialState = {
    records: []
}

const recordsSlice = createSlice({
    name: "records",
    initialState,
    reducers: { 
        recordAdded(records, action) {
            console.log("---1---");
        },
    }
});

const selectRecords = (state: RootState) => state.records;

export const { recordAdded } = recordsSlice.actions;
export { selectRecords };
export default recordsSlice.reducer;
