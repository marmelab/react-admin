import { delay } from 'redux-saga';
import { put, call, cancelled } from 'redux-saga/effects';

export const FETCH_START = 'FETCH_START';
export const FETCH_END = 'FETCH_END';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_CANCEL = 'FETCH_CANCEL';

function status(response) {
    if (!response.status || response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }

    return response.json()
        .then(json => Promise.reject(new Error((json && json.message) || response.statusText)))
}

function json(response) {
    if (response.status === 204) {
        return Promise.resolve(null);
    }

    return response.json();
}

export const fetchJson = (url, options = {}) => {
    const headers = {
        Accept: 'application/json',
    };
    if (!(options && options.body && options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    if (options.user && options.user.authenticated && options.user.authenticated) {
        headers.Authorization = options.user.token;
    }

    return fetch(url, { ...options, headers, credentials: 'include' })
        .then(status)
        .then(json);
};

export const fetchSagaFactory = (actionName) => {
    return function *handleFetch(action) {
        try {
            yield [
                put({ ...action, type: `${actionName}_LOADING` }),
                put({ type: FETCH_START }),
            ];
            // FIXME simulate response delay, to be removed
            yield call(delay, 1000);
            const { url, options } = action.payload;
            const response = yield fetchJson(url, options);
            yield [
                put({ ...action, type: `${actionName}_SUCCESS`, payload: { response } }),
                put({ type: FETCH_END }),
            ];
        } catch (error) {
            yield [
                put({ ...action, type: `${actionName}_FAILURE`, error }),
                put({ type: FETCH_ERROR }),
            ];
        } finally {
            if (yield cancelled()) {
                yield put({ type: FETCH_CANCEL });
            }
        }
    };
};

export const queryParameters = (data) => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
