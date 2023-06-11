import * as t from "io-ts";

const TimerIO = t.type({
    duration: t.number,
})
export type TimerT = t.TypeOf<typeof TimerIO>;

export const TimerStorageIO = t.type({
    timer: TimerIO, 
    version: t.string
});
export type TimerStorage = t.TypeOf<typeof TimerStorageIO>;

