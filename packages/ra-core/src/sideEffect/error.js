import { all, put, takeEvery } from 'redux-saga/effects';
import { CRUD_GET_ONE_SUCCESS } from '../actions/dataActions';
import { showNotification } from '../actions/notificationActions';

/**
 * Side effects for fetch responses
 *
 * Mostly corenr case handling
 */
function* handleResponse({ type, requestPayload, payload }) {
    switch (type) {
        case CRUD_GET_ONE_SUCCESS:
            if (
                !('id' in payload.data) ||
                payload.data.id != requestPayload.id
            ) {
                return yield put(
                    showNotification('ra.notification.bad_item', 'warning')
                );
            }
            break;
        default:
            return yield all([]);
    }
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.fetchResponse,
        handleResponse
    );
}
