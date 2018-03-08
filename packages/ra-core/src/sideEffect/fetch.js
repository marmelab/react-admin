import {
    actionChannel,
    all,
    put,
    call,
    cancel,
    cancelled,
    fork,
    take,
    select,
} from 'redux-saga/effects';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../actions/fetchActions';

export function* handleFetch(dataProvider, action) {
    const {
        type,
        payload,
        meta: { fetch: fetchMeta, onSuccess, ...meta },
    } = action;
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
                ...onSuccess,
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
export const takeFetchAction = action => action.meta && action.meta.fetch;
const fetch = dataProvider => {
    return function* watchFetch() {
        const runningTasks = {};
        const fetchActionQueue = yield actionChannel(takeFetchAction)
        while (true) {
            const action = yield take(fetchActionQueue);

            const isOptimistic = yield select(
                state => state.admin.ui.optimistic
            );
            if (isOptimistic) {
                // in optimistic mode, all fetch actions are canceled,
                // so the admin uses the store without synchronization
                continue;
            }

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

export default fetch;
