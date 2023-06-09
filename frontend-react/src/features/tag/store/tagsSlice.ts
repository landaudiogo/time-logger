import { RootState, store } from "store";
import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";

import { TagT, TagsStorageV1T } from "../types";
import { loadTagsFromLocalStorage, saveTagsToLocalStorage, tagsStorageToState } from "../lib/storage";
import { TagsStore } from "../types/store";


const storageTags = loadTagsFromLocalStorage();
const tagsState = tagsStorageToState(storageTags);

const initialState: { [key: string]: TagT } = tagsState;

const tagsSlice = createSlice({
    name: "tags",
    initialState,
    reducers: {
        tagAdded(tags, action: PayloadAction<TagT>) {
            tags[action.payload.tagString] = action.payload;
        },
        tagDeleted(tags, action: PayloadAction<TagT>) { 
            delete tags[action.payload.tagString];
        }
    }

})
const tagsReducer = tagsSlice.reducer;

const tagsRootReducer: typeof tagsReducer = (state, action) => {
    if (action.type === "concurrent/tags") {
        console.log(action.type);
        return tagsReducer(action.payload, action);
    }
    return tagsReducer(state, action);
}

const { tagAdded, tagDeleted } = tagsSlice.actions;

const selectTags = (state: RootState) => state.tags;

function addTag(tagString: string) {

    return (dispatch: Dispatch, getState: () => RootState) => {
        tagString = tagString.trim()
        if (tagString === "") {
            return;
        }
        dispatch(tagAdded({ tagString }));
        const tags = selectTags(getState());
        saveTagsToLocalStorage(tags);
    }
}

function deleteTag(tagString: string) {

    return (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(tagDeleted({ tagString }));
        const tags = selectTags(getState());
        saveTagsToLocalStorage(tags);
    }
}


export default tagsRootReducer;
export { addTag, deleteTag, selectTags };
