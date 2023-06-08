import Tag from "./components/Tag";
import { addTag } from "./store/tagsSlice";
import tagsReducer from "./store/tagsSlice";
import { loadTagsFromLocalStorage, tagsStorageToState } from "./lib/storage";

export { Tag, addTag, tagsReducer };
export { loadTagsFromLocalStorage, tagsStorageToState }
