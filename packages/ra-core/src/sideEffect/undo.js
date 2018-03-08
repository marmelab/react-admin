import { call, take, takeEvery, put, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { showNotification } from '../actions/notificationActions';
import {
    UNDOABLE,
    UNDO,
    startOptimisticMode,
    stopOptimisticMode,
} from '../actions/undoActions';
import { refreshView } from '../actions/uiActions';

export function* handleUndoRace(undoableAction) {
    const { payload: { action, delay: cancelDelay } } = undoableAction;
    const { onSuccess, ...metaWithoutSuccessSideEffects } = action.meta;
    yield put(startOptimisticMode());
    // dispatch action in optimistic mode (no fetch), with success side effects
    yield put({
        ...action,
        type: `${action.type}_OPTIMISTIC`,
        meta: {
            ...metaWithoutSuccessSideEffects,
            ...onSuccess,
        },
    });
    // wait for undo or delay
    const { timeout } = yield race({
        undo: take(UNDO),
        timeout: call(delay, cancelDelay),
    });
    yield put(stopOptimisticMode());
    if (timeout) {
        // if not cancelled, redispatch the action, this time immediate, and without success side effect
        yield put({
            ...action,
            meta: metaWithoutSuccessSideEffects,
        });
    } else {
        yield put(showNotification('ra.notification.canceled'));
        yield put(refreshView());
    }
}

export default function* watchUndoable() {
    yield takeEvery(UNDOABLE, handleUndoRace);
}
