import { all, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';
import {
    CRUD_CREATE_FAILURE,
    CRUD_CREATE_SUCCESS,
    CRUD_DELETE_FAILURE,
    CRUD_DELETE_SUCCESS,
    CRUD_DELETE_MANY_FAILURE,
    CRUD_DELETE_MANY_SUCCESS,
    CRUD_GET_LIST_FAILURE,
    CRUD_GET_MANY_FAILURE,
    CRUD_GET_MANY_REFERENCE_FAILURE,
    CRUD_GET_ONE_SUCCESS,
    CRUD_GET_ONE_FAILURE,
    CRUD_UPDATE_FAILURE,
    CRUD_UPDATE_SUCCESS,
    CRUD_UPDATE_MANY_FAILURE,
    CRUD_UPDATE_MANY_SUCCESS,
} from '../../actions/dataActions';
import { showNotification } from '../../actions/notificationActions';
import { refreshView } from '../../actions/uiActions';
import { setListSelectedIds } from '../../actions/listActions';
import resolveRedirectTo from '../../util/resolveRedirectTo';

/**
 * Side effects for fetch responses
 *
 * Mostly redirects and notifications
 */
function* handleResponse({ type, requestPayload, error, payload, meta }) {
    switch (type) {
        case CRUD_UPDATE_SUCCESS:
        case CRUD_UPDATE_MANY_SUCCESS: {
            if (requestPayload.refresh) {
                return yield push(put(refreshView()));
            }
            return;
        }
        case CRUD_CREATE_SUCCESS:
            return requestPayload.redirectTo
                ? yield all([
                      put(showNotification('ra.notification.created')),
                      put(
                          push(
                              resolveRedirectTo(
                                  requestPayload.redirectTo,
                                  requestPayload.basePath,
                                  payload.data.id
                              )
                          )
                      ),
                  ])
                : yield all([
                      put(showNotification('ra.notification.created')),
                      put(reset('record-form')),
                  ]);
        case CRUD_DELETE_SUCCESS:
        case CRUD_DELETE_MANY_SUCCESS: {
            if (requestPayload.refresh) {
                return yield put(refreshView());
            }
            return;
        }
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
        case CRUD_GET_ONE_FAILURE:
            return requestPayload.basePath
                ? yield all([
                      put(
                          showNotification(
                              'ra.notification.item_doesnt_exist',
                              'warning'
                          )
                      ),
                      put(push(requestPayload.basePath)),
                  ])
                : yield all([]);
        case CRUD_GET_LIST_FAILURE:
        case CRUD_GET_MANY_FAILURE:
        case CRUD_GET_MANY_REFERENCE_FAILURE:
        case CRUD_CREATE_FAILURE:
        case CRUD_UPDATE_FAILURE:
        case CRUD_UPDATE_MANY_FAILURE:
        case CRUD_DELETE_FAILURE:
        case CRUD_DELETE_MANY_FAILURE: {
            console.error(error); // eslint-disable-line no-console
            const errorMessage =
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error';

            return yield [
                put(refreshView()),
                put(showNotification(errorMessage, 'warning')),
            ];
        }
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
