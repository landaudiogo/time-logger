import { Tag, TagsStorageV1, TagsStorageV1T } from "../types";
import { isLeft } from "fp-ts/Either";

export function loadTagsFromLocalStorage(): TagsStorageV1T | null {
    const tagsJSON = localStorage.getItem("tags");
    if (tagsJSON === null || tagsJSON === "") {
        return null;
    }
    let tagsObject = {}; 
    try {
        tagsObject = JSON.parse(tagsJSON);
    } catch (error) {}


    const decoded = TagsStorageV1.decode(tagsObject);
    if (isLeft(decoded)) { 
        console.log("Could not decode");
        return null;
    }
    const decodedTagsStorage: TagsStorageV1T = decoded.right;
    return decodedTagsStorage;
}

export function saveTagsToLocalStorage(tags: {[key: string]: Tag}) { 
    const tagsStorage = {
        tags: Object.values(tags), 
        version: "v1",
    }
    localStorage.setItem("tags", JSON.stringify(tagsStorage));
}

export function tagsStorageToState(tagsStorage: TagsStorageV1T | null) {
    if (tagsStorage === null) {
        return {};
    }
    return Object.values(tagsStorage.tags).reduce(
        (acc, tag) => {
            acc[tag.tagString] = tag;
            return acc
        },
        {} as { [key: string]: Tag }
    );
}
