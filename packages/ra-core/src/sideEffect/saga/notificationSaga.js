import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from '../../actions/notificationActions';

/**
 * Notification Side Effects
 */
function* handleNotification({ meta: { notification } }) {
    const {
        body,
        level = 'info',
        messageArgs = {},
        cancellable = false,
    } = notification;
    yield put(
        showNotification(body, level, {
            messageArgs,
            cancellable,
        })
    );
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.notification,
        handleNotification
    );
}
