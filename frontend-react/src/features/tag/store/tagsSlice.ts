import { RootState, store } from "store";
import { createSlice, PayloadAction, Dispatch } from "@reduxjs/toolkit";

import { Tag, TagsStorageV1T } from "../types";
import { loadTagsFromLocalStorage, saveTagsToLocalStorage, tagsStorageToState } from "../lib/storage";
import { TagsStore } from "../types/store";


const storageTags = loadTagsFromLocalStorage();
const tagsState = tagsStorageToState(storageTags);

const initialState: { [key: string]: Tag } = tagsState;

type TagAdded = {
    tagString: string
};

const tagsSlice = createSlice({
    name: "tags",
    initialState,
    reducers: {
        tagAdded(tags, action: PayloadAction<TagAdded>) {
            tags[action.payload.tagString] = action.payload;
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

const tagAdded = tagsSlice.actions.tagAdded;

const selectTags = (state: RootState) => state.tags;

function addTag(tagString: string) {

    return (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(tagAdded({ tagString }));
        const tags = selectTags(getState());
        saveTagsToLocalStorage(tags);
    }
}


export default tagsRootReducer;
export { addTag, selectTags };
