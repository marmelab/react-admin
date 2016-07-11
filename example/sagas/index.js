import { takeLatest, delay } from 'redux-saga';
import { put, call, cancelled } from 'redux-saga/effects';
import {
    queryParameters,
    fetchJson,
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../src/util/fetch';
import {
    CRUD_FETCH,
    CRUD_FETCH_LOADING,
    CRUD_FETCH_SUCCESS,
    CRUD_FETCH_FAILURE,
    GET_MANY,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
} from '../../src/data/actions';

const root = 'http://localhost:3000';

const buildUrl = (resource, method, params) => {
    switch (method) {
    case GET_MANY: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        };
        return `${root}/${resource}?${queryParameters(query)}`;
    }
    case GET_ONE:
        return `${root}/${resource}/${params.id}`;
    default:
        throw new Error(`Unsupported fetch method ${method}`);
    }
};

const convertResponse = (resource, method, response) => {
    const { status, headers, body, json } = response;
    switch (method) {
    case GET_MANY:
        return {
            data: json.map(x => x),
            total: parseInt(headers['content-range'].split('/').pop(), 10),
        };
    case GET_ONE:
        return json;
    default:
        throw new Error(`Unsupported action type ${type}`);
    }
};

function *handleFetch(action) {
    const { method, params } = action.payload;
    const { resource } = action.meta;
    yield [
        put({ ...action, type: CRUD_FETCH_LOADING }),
        put({ type: FETCH_START }),
    ];
    const url = buildUrl(resource, method, params);
    let response;
    try {
        // simulate response delay
        yield call(delay, 1000);
        response = yield fetchJson(url);
    } catch (error) {
        yield [
            put({ ...action, type: CRUD_FETCH_FAILURE, error }),
            put({ type: FETCH_ERROR }),
        ];
        return;
    } finally {
        if (yield cancelled()) {
            yield put({ type: FETCH_CANCEL });
            return;
        }
    }
    yield [
        put({ ...action, type: CRUD_FETCH_SUCCESS, payload: { method, ...convertResponse(resource, method, response) } }),
        put({ type: FETCH_END }),
    ];
};

function *watchCrudFetch() {
    yield* takeLatest(CRUD_FETCH, handleFetch);
}

export default watchCrudFetch;
