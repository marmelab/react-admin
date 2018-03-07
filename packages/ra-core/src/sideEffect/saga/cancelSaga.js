import { call, take, takeEvery, put, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { push } from 'react-router-redux';

import {
    showNotification,
    hideNotification,
} from '../../actions/notificationActions';
import {
    CANCELLABLE,
    CANCEL,
    startOptimisticMode,
    stopOptimisticMode,
} from '../../actions/cancelActions';
import { refreshView } from '../../actions/uiActions';

function* handleCancelRace(cancellableAction) {
    const { payload: { action, delay: cancelDelay } } = cancellableAction;
    yield put(startOptimisticMode());
    // dispatch action in optimistic mode (no fetch), and make notification cancellable
    yield put({
        ...action,
        type: `${action.type}_OPTIMISTIC`,
        meta: {
            ...action.meta,
            ...action.meta.onSuccess,
        },
    });
    yield put(refreshView());
    // launch cancellable race
    const { timeout } = yield race({
        cancel: take(CANCEL),
        timeout: call(delay, cancelDelay),
    });
    yield put(stopOptimisticMode());
    // whether the notification times out or is canceled, hide it
    yield put(hideNotification());
    if (timeout) {
        // if not cancelled, redispatch the action, this time immediate, and without success side effect
        const { onSuccess, ...metaWithoutSuccessSideEffects } = action.meta;
        yield put({
            ...action,
            meta: metaWithoutSuccessSideEffects,
        });
    } else {
        yield put(showNotification('ra.notification.canceled'));
        yield put(refreshView());
    }
}

export default function* watchCancellable() {
    yield takeEvery(CANCELLABLE, handleCancelRace);
}
