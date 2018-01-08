import {
    all,
    put,
    call,
    cancelled,
    take,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_ERROR_AUTH,
    FETCH_ERROR_UNHANDLED,
    FETCH_CANCEL,
} from '../../actions/fetchActions';
import { FETCH_ERROR_VALIDATION } from '../../actions';

const crudFetch = dataProvider => {
    function* handleFetch(action) {
        const { type, payload, meta: { fetch: fetchMeta, ...meta } } = action;
        const restType = fetchMeta;

        yield all([
            put({
                type: `${type}_LOADING`,
                payload,
                meta: { ...meta },
            }),
            put({ type: FETCH_START, meta: { id: action } }),
        ]);
        let response;
        try {
            response = yield call(
                dataProvider,
                restType,
                meta.resource,
                payload
            );
            if (!response.data) {
                throw new Error('REST response must contain a data key');
            }
            yield put({
                type: `${type}_SUCCESS`,
                payload: response,
                requestPayload: payload,
                meta: {
                    ...meta,
                    fetchResponse: restType,
                    fetchStatus: FETCH_END,
                },
            });
            yield put({ type: FETCH_END, meta: { id: action } });
        } catch (error) {
            yield put({
                type: FETCH_ERROR_VALIDATION,
                error,
                meta: { id: action },
            });

            const { type: validationResponse } = yield take(
                ({ meta }) => meta && meta.id === action
            );
            if (FETCH_ERROR_UNHANDLED === validationResponse) {
                yield put({
                    type: FETCH_ERROR_AUTH,
                    error,
                    meta: {
                        id: action,
                    },
                });
                const { type: authResponse } = yield take(
                    ({ meta }) => meta && meta.id === action
                );

                if (FETCH_ERROR_UNHANDLED === authResponse) {
                    yield put({
                        type: `${type}_FAILURE`,
                        error: error.message ? error.message : error,
                        payload: error.body ? error.body : null,
                        requestPayload: payload,
                        meta: {
                            ...meta,
                            fetchResponse: restType,
                            fetchStatus: FETCH_ERROR,
                        },
                    });
                }
            }
            yield put({
                type: FETCH_ERROR,
                error,
                meta: {
                    id: action,
                },
            });
        } finally {
            if (yield cancelled()) {
                yield put({ type: FETCH_CANCEL, meta: { id: action } });
                return; /* eslint no-unsafe-finally:0 */
            }
        }
    }

    return function* watchCrudFetch() {
        yield all([
            takeLatest(
                action =>
                    action.meta &&
                    action.meta.fetch &&
                    action.meta.cancelPrevious,
                handleFetch
            ),
            takeEvery(
                action =>
                    action.meta &&
                    action.meta.fetch &&
                    !action.meta.cancelPrevious,
                handleFetch
            ),
        ]);
    };
};

export default crudFetch;
