import {
    all,
    call,
    cancelled,
    put,
    select,
    takeEvery,
} from 'redux-saga/effects';
import {
    FETCH_CANCEL,
    FETCH_END,
    FETCH_ERROR,
    FETCH_START,
} from '../actions/fetchActions';
import {
    fetchActionsWithRecordResponse,
    fetchActionsWithArrayOfIdentifiedRecordsResponse,
    fetchActionsWithArrayOfRecordsResponse,
    fetchActionsWithTotalResponse,
} from '../dataFetchActions';

function validateResponseFormat(
    response,
    type,
    logger = console.error // eslint-disable-line no-console
) {
    if (!response.hasOwnProperty('data')) {
        logger(
            `The response to '${type}' must be like { data: ... }, but the received response does not have a 'data' key. The dataProvider is probably wrong for '${type}'.`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithArrayOfRecordsResponse.includes(type) &&
        !Array.isArray(response.data)
    ) {
        logger(
            `The response to '${type}' must be like { data : [...] }, but the received data is not an array. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithArrayOfIdentifiedRecordsResponse.includes(type) &&
        Array.isArray(response.data) &&
        response.data.length > 0 &&
        !response.data[0].hasOwnProperty('id')
    ) {
        logger(
            `The response to '${type}' must be like { data : [{ id: 123, ...}, ...] }, but the received data items do not have an 'id' key. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithRecordResponse.includes(type) &&
        !response.data.hasOwnProperty('id')
    ) {
        logger(
            `The response to '${type}' must be like { data: { id: 123, ... } }, but the received data does not have an 'id' key. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
    if (
        fetchActionsWithTotalResponse.includes(type) &&
        !response.hasOwnProperty('total')
    ) {
        logger(
            `The response to '${type}' must be like  { data: [...], total: 123 }, but the received response does not have a 'total' key. The dataProvider is probably wrong for '${type}'`
        );
        throw new Error('ra.notification.data_provider_error');
    }
}

export function* handleFetch(dataProvider, action) {
    const {
        type,
        payload,
        meta: { fetch: fetchMeta, onSuccess, onFailure, ...meta },
    } = action;
    const restType = fetchMeta;

    try {
        const isOptimistic = yield select(state => state.admin.ui.optimistic);
        if (isOptimistic) {
            // in optimistic mode, all fetch actions are canceled,
            // so the admin uses the store without synchronization
            return;
        }

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
        process.env.NODE_ENV !== 'production' &&
            validateResponseFormat(response, restType);
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
                ...onFailure,
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
        yield takeEvery(takeFetchAction, handleFetch, dataProvider);
    };
};

export default fetch;
