import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from '../actions/notificationActions';

/**
 * Notification Side Effects
 */
function* handleNotification({ error, meta: { notification, optimistic } }) {
    const { body, level, messageArgs = {} } = notification;
    if (error) {
        return yield put(
            showNotification(
                typeof error === 'string' ? error : error.message || body,
                level || 'warning',
                {
                    messageArgs,
                    undoable: false,
                }
            )
        );
    }
    yield put(
        showNotification(body, level || 'info', {
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
