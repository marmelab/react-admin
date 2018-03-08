export const UNDOABLE = 'RA/UNDOABLE';
export const UNDO = 'RA/UNDO';
export const START_OPTIMISTIC_MODE = 'RA/START_OPTIMISTIC_MODE';
export const STOP_OPTIMISTIC_MODE = 'RA/STOP_OPTIMISTIC_MODE';

export const startUndoable = (action, delay = 4000) => ({
    type: UNDOABLE,
    payload: { action, delay },
});

export const undo = () => ({
    type: UNDO,
});

export const startOptimisticMode = () => ({
    type: START_OPTIMISTIC_MODE,
});

export const stopOptimisticMode = () => ({
    type: STOP_OPTIMISTIC_MODE,
});
