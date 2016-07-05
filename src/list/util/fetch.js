import { put } from 'redux-saga/effects';

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

const fetchJson = (url, options = {}) => {
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
            yield put({ ...action, type: `${actionName}_LOADING` });
            const { url, options } = action.payload;
            const response = yield fetchJson(url, options);
            yield put({ ...action, type: `${actionName}_SUCCESS`, payload: { response } });
        } catch (error) {
            yield put({ ...action, type: `${actionName}_FAILURE`, error });
        }
    };
};
