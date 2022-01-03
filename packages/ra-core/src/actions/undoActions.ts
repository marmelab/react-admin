export const UNDOABLE = 'RA/UNDOABLE';

export interface StartUndoableAction {
    readonly type: typeof UNDOABLE;
    readonly payload: any;
}

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
