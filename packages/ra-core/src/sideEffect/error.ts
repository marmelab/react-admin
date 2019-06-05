import { all, put, takeEvery } from 'redux-saga/effects';
import { CRUD_GET_ONE_SUCCESS, CrudGetOneSuccessAction } from '../actions/dataActions';
import { showNotification } from '../actions/notificationActions';

type ActionTypes = CrudGetOneSuccessAction | { type: 'OTHER_TYPE'; requestPayload?: any; payload?: any };

/**
 * Side effects for fetch responses
 *
 * Mostly corner case handling
 */
function* handleResponse(action: ActionTypes) {
    const { type, requestPayload, payload } = action;
    switch (type) {
        case CRUD_GET_ONE_SUCCESS:
            if (
                !('id' in payload.data) ||
                payload.data.id != requestPayload.id // tslint:disable-line triple-equals
            ) {
                return yield put(showNotification('ra.notification.bad_item', 'warning'));
            }
            break;
        default:
            return yield all([]);
    }
}

export default function*() {
    yield takeEvery(action => action.meta && action.meta.fetchResponse, handleResponse);
}
