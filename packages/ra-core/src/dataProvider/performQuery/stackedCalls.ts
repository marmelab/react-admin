import { doQuery } from './doQuery';

let nbRemainingStackedCalls = 0;
export const getRemainingStackedCalls = () => nbRemainingStackedCalls;

// List of dataProvider calls emitted while in optimistic mode.
// These calls get replayed once the dataProvider exits optimistic mode
const stackedCalls = [];
export const stackCall = params => {
    stackedCalls.push(params);
    nbRemainingStackedCalls++;
};

const stackedOptimisticCalls = [];
export const stackOptimisticCall = params => {
    stackedOptimisticCalls.push(params);
    nbRemainingStackedCalls++;
};

// Replay calls recorded while in optimistic mode
export const replayStackedCalls = async () => {
    let clone;

    // We must perform any undoable queries first so that the effects of previous undoable
    // queries do not conflict with this one.

    // We only handle all side effects queries if there are no more undoable queries
    if (stackedOptimisticCalls.length > 0) {
        clone = [...stackedOptimisticCalls];
        // remove these calls from the list *before* doing them
        // because side effects in the calls can add more calls
        // so we don't want to erase these.
        stackedOptimisticCalls.splice(0, stackedOptimisticCalls.length);

        await Promise.all(
            clone.map(params => Promise.resolve(doQuery.call(null, params)))
        );
        // once the calls are finished, decrease the number of remaining calls
        nbRemainingStackedCalls -= clone.length;
    } else {
        clone = [...stackedCalls];
        // remove these calls from the list *before* doing them
        // because side effects in the calls can add more calls
        // so we don't want to erase these.
        stackedCalls.splice(0, stackedCalls.length);

        await Promise.all(
            clone.map(params => Promise.resolve(doQuery.call(null, params)))
        );
        // once the calls are finished, decrease the number of remaining calls
        nbRemainingStackedCalls -= clone.length;
    }
};
