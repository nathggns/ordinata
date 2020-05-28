// @todo replace with proper test suite
import { createSelector } from "reselect";
import produce from "immer";
import { filter, pick } from "./ordinata";

export type Thing = {
    a: string;
    b: boolean;
    c: string;
};

export type ThingSlice = {
    entities: Thing[];
};

export type RootState = {
    things: ThingSlice;
};

export const state: RootState = {
    things: {
        entities: [
            {
                a: "one",
                b: true,
                c: ""
            },
            {
                a: "two",
                b: false,
                c: ""
            },
            {
                a: "three",
                b: true,
                c: ""
            }
        ]
    }
};

export const selectThings = (state: RootState) => state.things.entities;

export function assert(val: any, error: string) {
    if (!val) {
        throw new Error(error);
    }
}


const filterBThings = createSelector(
    [selectThings],
    filter<Thing>()(thing => thing.b)
);

const pickA = createSelector(
    [filterBThings],
    pick<Thing>()(["a"])
);

const keys = createSelector(
    [pickA],
    entities => entities.map(entity => Object.keys(entity))
);

const state2 = produce(state, draft => {
    draft.things.entities[1].a += "1";
});

const state3 = produce(state, draft => {
    draft.things.entities[1].a += "1";
    draft.things.entities[0].c += "1";
});

assert(filterBThings(state) === filterBThings(state2), "filter not stable");
assert(pickA(state) === pickA(state3), "pick not stable");
assert(keys(state) === keys(state3), "keys not stable");

