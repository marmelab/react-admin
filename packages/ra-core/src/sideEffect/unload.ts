import { takeEvery } from 'redux-saga/effects';

import {
    START_OPTIMISTIC_MODE,
    STOP_OPTIMISTIC_MODE,
} from '../actions/undoActions';

/**
 * Unload saga
 *
 * When a user closes the browser window while an optimistic update/delete
 * hasn't been sent to the dataProvider yet, warn them that their edits
 * may be lost.
 *
 * To achieve that, this saga registers a window event handler on the
 * 'beforeunload' event when entering the optimistic mode, and removes
 * the event when quitting the optimistic mode.
 */
export default function* watchUnload() {
    yield takeEvery(START_OPTIMISTIC_MODE, handleStartOptimistic);
    yield takeEvery(STOP_OPTIMISTIC_MODE, handleStopOptimisticMode);
}

const eventListener = event => {
    event.preventDefault(); // standard
    event.returnValue = ''; // Chrome
    return 'Your latest modifications are not yet sent to the server. Are you sure?'; // Old IE
};

export function* handleStartOptimistic() {
    // SSR escape hatch
    if (!window) {
        return;
    }
    window.addEventListener('beforeunload', eventListener);
}

export function* handleStopOptimisticMode() {
    // SSR escape hatch
    if (!window) {
        return;
    }
    window.removeEventListener('beforeunload', eventListener);
}
