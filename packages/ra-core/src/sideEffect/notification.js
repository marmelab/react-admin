import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from '../actions/notificationActions';

/**
 * Notification Side Effects
 */
function* handleNotification({ meta: { notification, optimistic } }) {
    const { body, level = 'info', messageArgs = {} } = notification;
    yield put(
        showNotification(body, level, {
            messageArgs,
            undoable: optimistic,
        })
    );
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.notification,
        handleNotification
    );
}
