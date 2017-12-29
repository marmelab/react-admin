import {
    all,
    put,
    call,
    cancelled,
    takeEvery,
    takeLatest,
    take,
    cancel,
} from 'redux-saga/effects';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';
import { USER_CHECK_FAILURE } from '../../actions/authActions';

const crudFetch = dataProvider => {
    function* handleFetch(action) {
        const { type, payload, meta: { fetch: fetchMeta, ...meta } } = action;
        const restType = fetchMeta;

        yield all([
            put({ type: `${type}_LOADING`, payload, meta }),
            put({ type: FETCH_START }),
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
            yield put({ type: FETCH_END });
        } catch (error) {
            yield put({
                type: `${type}_FAILURE`,
                error,
                requestPayload: payload,
                meta: {
                    ...meta,
                    fetchResponse: restType,
                    fetchStatus: FETCH_ERROR,
                },
            });
            yield put({ type: FETCH_ERROR, error });
        } finally {
            if (yield cancelled()) {
                yield put({ type: FETCH_CANCEL });
                return; /* eslint no-unsafe-finally:0 */
            }
        }
    }

    return function* watchCrudFetch() {
        while (true) {
            const [taskLatest, taskEvery] = yield all([
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

            yield take(USER_CHECK_FAILURE);
            yield all([cancel(taskLatest, taskEvery)]);
        }
    };
};

export default crudFetch;
