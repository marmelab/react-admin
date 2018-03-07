import {
    all,
    put,
    call,
    cancel,
    cancelled,
    fork,
    take,
} from 'redux-saga/effects';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';

export const takeFetchAction = action => action.meta && action.meta.fetch;
export function* handleFetch(dataProvider, action) {
    const { type, payload, meta: { fetch: fetchMeta, ...meta } } = action;
    const restType = fetchMeta;

    try {
        yield all([
            put({ type: `${type}_LOADING`, payload, meta }),
            put({ type: FETCH_START }),
        ]);
        let response = yield call(
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
            error: error.message ? error.message : error,
            payload: error.body ? error.body : null,
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

const crudFetch = dataProvider => {
    return function* watchCrudFetch() {
        const runningTasks = {};

        while (true) {
            const action = yield take(takeFetchAction);
            const { cancelPrevious, resource } = action.meta;

            if (cancelPrevious && runningTasks[resource]) {
                runningTasks[resource] = yield cancel(runningTasks[resource]);
            }
            runningTasks[resource] = yield fork(
                handleFetch,
                dataProvider,
                action
            );
        }
    };
};

export default crudFetch;
