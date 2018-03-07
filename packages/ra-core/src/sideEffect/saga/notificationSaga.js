import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from '../../actions/notificationActions';

/**
 * Notification Side Effects
 */
function* handleNotification({ type, meta: { notification } }) {
    const { body, level = 'info', messageArgs = {} } = notification;
    yield put(
        showNotification(body, level, {
            messageArgs,
            cancellable: type.indexOf('_OPTIMISTIC') !== -1,
        })
    );
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.notification,
        handleNotification
    );
}
