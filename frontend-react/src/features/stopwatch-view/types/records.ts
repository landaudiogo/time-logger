import * as t from "io-ts";

export const LapRecordIO = t.type({
    id: t.string,
    startTime: t.number, 
    endTime: t.number,
    tag: t.string,
})
export type LapRecord = t.TypeOf<typeof LapRecordIO>;


export const RecordsStorageV0IO = t.type({
    records: t.array(LapRecordIO)
})
export type RecordsStorageV0 = t.TypeOf<typeof RecordsStorageV0IO>;


export const RecordsStorageV1IO = t.type({
    records: t.array(LapRecordIO),
    version: t.string,
});
export type RecordsStorageV1 = t.TypeOf<typeof RecordsStorageV1IO>;

export type Records = {
    [key: string]: LapRecord
}
