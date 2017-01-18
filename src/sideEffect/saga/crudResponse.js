import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {
    CRUD_CREATE_FAILURE,
    CRUD_CREATE_SUCCESS,
    CRUD_DELETE_FAILURE,
    CRUD_DELETE_SUCCESS,
    CRUD_GET_LIST_FAILURE,
    CRUD_GET_MANY_FAILURE,
    CRUD_GET_MANY_REFERENCE_FAILURE,
    CRUD_GET_ONE_FAILURE,
    CRUD_UPDATE_FAILURE,
    CRUD_UPDATE_SUCCESS,
} from '../../actions/dataActions';
import { showNotification } from '../../actions/notificationActions';
import linkToRecord from '../../util/linkToRecord';

/**
 * Side effects for fetch responses
 *
 * Mostly redirects and notifications
 */
function* handleResponse({ type, requestPayload, error, payload }) {
    switch (type) {
    case CRUD_UPDATE_SUCCESS:
        return yield [
            put(showNotification('Element updated')),
            put(push(requestPayload.basePath)),
        ];
    case CRUD_CREATE_SUCCESS:
        return yield [
            put(showNotification('Element created')),
            put(push(linkToRecord(requestPayload.basePath, payload.id))),
        ];
    case CRUD_DELETE_SUCCESS:
        return yield [
            put(showNotification('Element deleted')),
            put(push(requestPayload.basePath)),
        ];
    case CRUD_GET_ONE_FAILURE:
        return requestPayload.basePath ? yield [
            put(showNotification('Element does not exist', 'warning')),
            put(push(requestPayload.basePath)),
        ] : yield [];
    case CRUD_GET_LIST_FAILURE:
    case CRUD_GET_MANY_FAILURE:
    case CRUD_GET_MANY_REFERENCE_FAILURE:
    case CRUD_CREATE_FAILURE:
    case CRUD_UPDATE_FAILURE:
    case CRUD_DELETE_FAILURE: {
        console.error(error);
        return yield [
            put(showNotification(error.message, 'warning')),
        ];
    }
    default:
        return yield [];
    }
}

export default function* () {
    yield takeEvery(action => action.meta && action.meta.fetchResponse, handleResponse);
}
