export const UNDOABLE = 'RA/UNDOABLE';

export interface StartUndoableAction {
    readonly type: typeof UNDOABLE;
    readonly payload: any;
}

export type StartUndoable = (action: any) => void;

export const startUndoable = (action: any): StartUndoableAction => ({
    type: UNDOABLE,
    payload: { action },
});

export const UNDO = 'RA/UNDO';

export interface UndoAction {
    readonly type: typeof UNDO;
}

export const undo = (): UndoAction => ({
    type: UNDO,
});

export const COMPLETE = 'RA/COMPLETE';

export interface CompleteAction {
    readonly type: typeof COMPLETE;
}

export const complete = (): CompleteAction => ({
    type: COMPLETE,
});

export const START_OPTIMISTIC_MODE = 'RA/START_OPTIMISTIC_MODE';

export interface StartOptimisticModeAction {
    readonly type: typeof START_OPTIMISTIC_MODE;
}

export const startOptimisticMode = (): StartOptimisticModeAction => ({
    type: START_OPTIMISTIC_MODE,
});

export const STOP_OPTIMISTIC_MODE = 'RA/STOP_OPTIMISTIC_MODE';

export interface StopOptimisticModeAction {
    readonly type: typeof STOP_OPTIMISTIC_MODE;
}

export const stopOptimisticMode = (): StopOptimisticModeAction => ({
    type: STOP_OPTIMISTIC_MODE,
});
