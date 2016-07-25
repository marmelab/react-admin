import { takeLatest, delay } from 'redux-saga';
import { put, call, cancelled } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { fetchJson } from '../util/fetch';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../actions/fetchActions';
import {
    CRUD_GET_LIST,
    CRUD_GET_ONE,
    CRUD_CREATE,
    CRUD_UPDATE,
    CRUD_DELETE,
} from '../actions/dataActions';
import { showNotification } from '../actions/notificationActions';

const crudSaga = (restFlavor) => {
    const getFailureSideEffects = (type, resource, payload, error) => {
        switch (type) {
        case CRUD_GET_ONE:
            return [
                showNotification('Element does not exist', 'warning'),
                push(payload.basePath),
            ];
        default:
            return [];
        }
    };

    const getSuccessSideEffects = (type, resource, payload, response) => {
        switch (type) {
        case CRUD_UPDATE:
            return [
                showNotification('Element updated'),
                push(payload.basePath),
            ];
        case CRUD_CREATE:
            return [
                showNotification('Element created'),
                push(`${payload.basePath}/${response.json.id}`),
            ];
        default:
            return [];
        }
    };

    function *handleFetch(action) {
        const { type, payload, meta } = action;
        delete meta.fetch;
        yield [
            put({ type: `${type}_LOADING`, payload, meta }),
            put({ type: FETCH_START }),
        ];
        const { url, options } = restFlavor.httpRequestFromAction(type, meta.resource, payload);
        let response;
        try {
            // simulate response delay
            yield call(delay, 1000);
            response = yield fetchJson(url, options);
        } catch (error) {
            const sideEffects = getFailureSideEffects(type, meta.resource, payload, error);
            yield [
                ...sideEffects.map(a => put(a)),
                put({ type: `${type}_FAILURE`, error, meta }),
                put({ type: FETCH_ERROR }),
            ];
            return;
        } finally {
            if (yield cancelled()) {
                yield put({ type: FETCH_CANCEL });
                return;
            }
        }
        const sideEffects = getSuccessSideEffects(type, meta.resource, payload, response);
        yield [
            ...sideEffects.map(a => put(a)),
            put({ type: `${type}_SUCCESS`, payload: restFlavor.successPayloadFromHttpResponse(type, meta.resource, payload, response), meta }),
            put({ type: FETCH_END }),
        ];
    }

    return function *watchCrudFetch() {
        yield* takeLatest(action => action.meta && action.meta.fetch, handleFetch);
    };
};


export default crudSaga;
