import { all, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';
import {
    crudCreate,
    crudDelete,
    crudGetList,
    crudGetMany,
    crudGetManyReference,
    crudGetOne,
    crudUpdate,
} from '../../actions/dataActions';
import { showNotification } from '../../actions/notificationActions';
import resolveRedirectTo from '../../util/resolveRedirectTo';

/**
 * Side effects for fetch responses
 *
 * Mostly redirects and notifications
 */
function* handleResponse({ type, requestPayload, error, payload }) {
    switch (type) {
        case crudUpdate.SUCCESS:
            return requestPayload.redirectTo
                ? yield all([
                      put(showNotification('ra.notification.updated')),
                      put(
                          push(
                              resolveRedirectTo(
                                  requestPayload.redirectTo,
                                  requestPayload.basePath,
                                  requestPayload.id
                              )
                          )
                      ),
                  ])
                : yield [put(showNotification('ra.notification.updated'))];
        case crudCreate.SUCCESS:
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
        case crudDelete.SUCCESS:
            return requestPayload.redirectTo
                ? yield all([
                      put(showNotification('ra.notification.deleted')),
                      put(
                          push(
                              resolveRedirectTo(
                                  requestPayload.redirectTo,
                                  requestPayload.basePath,
                                  requestPayload.id
                              )
                          )
                      ),
                  ])
                : yield [put(showNotification('ra.notification.deleted'))];
        case crudGetOne.SUCCESS:
            if (
                !('id' in payload.data) ||
                payload.data.id != requestPayload.id
            ) {
                return yield put(
                    showNotification('ra.notification.bad_item', 'warning')
                );
            }
            break;
        case crudGetOne.FAILURE:
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
        case crudCreate.FAILURE:
        case crudUpdate.FAILURE:
        case crudGetList.FAILURE:
        case crudGetMany.FAILURE:
        case crudGetManyReference.FAILURE:
        case crudDelete.FAILURE: {
            console.error(error); // eslint-disable-line no-console
            const errorMessage =
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error';
            return yield put(showNotification(errorMessage, 'warning'));
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
