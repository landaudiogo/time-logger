import * as t from "io-ts";

const TagIO = t.type({
    tagString: t.string
});
export type TagT = t.TypeOf<typeof TagIO>;

export const TagsStorageV1 = t.type({
    tags: t.array(TagIO),
    version: t.string
})
export type TagsStorageV1T = t.TypeOf<typeof TagsStorageV1>;
