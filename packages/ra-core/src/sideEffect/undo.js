import { take, takeEvery, put, race } from 'redux-saga/effects';

import { showNotification } from '../actions/notificationActions';
import {
    UNDOABLE,
    UNDO,
    COMPLETE,
    startOptimisticMode,
    stopOptimisticMode,
} from '../actions/undoActions';
import { refreshView } from '../actions/uiActions';

export function* handleUndoRace(undoableAction) {
    const { payload: { action } } = undoableAction;
    const { onSuccess, ...metaWithoutSuccessSideEffects } = action.meta;
    yield put(startOptimisticMode());
    // dispatch action in optimistic mode (no fetch), with success side effects
    yield put({
        ...action,
        type: `${action.type}_OPTIMISTIC`,
        meta: {
            ...metaWithoutSuccessSideEffects,
            ...onSuccess,
            optimistic: true,
        },
    });
    // wait for undo or delay
    const { complete } = yield race({
        undo: take(UNDO),
        complete: take(COMPLETE),
    });
    yield put(stopOptimisticMode());
    if (complete) {
        // if not cancelled, redispatch the action, this time immediate, and without success side effect
        yield put({
            ...action,
            meta: {
                ...metaWithoutSuccessSideEffects,
                onSuccess: { refresh: true },
            },
        });
    } else {
        yield put(showNotification('ra.notification.canceled'));
        yield put(refreshView());
    }
}

export default function* watchUndoable() {
    yield takeEvery(UNDOABLE, handleUndoRace);
}
