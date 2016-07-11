export const FETCH_START = 'FETCH_START';
export const FETCH_END = 'FETCH_END';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_CANCEL = 'FETCH_CANCEL';

export const fetchJson = (url, options = {}) => {
    const requestHeaders = {
        Accept: 'application/json',
    };
    if (!(options && options.body && options.body instanceof FormData)) {
        requestHeaders['Content-Type'] = 'application/json';
    }
    if (options.user && options.user.authenticated && options.user.authenticated) {
        requestHeaders.Authorization = options.user.token;
    }

    let status, statusText, headers = {}, body, json;

    return fetch(url, { ...options, headers: requestHeaders, credentials: 'include' })
        .then(response => {
            for (var pair of response.headers.entries()) {
                headers[pair[0]] = pair[1];
            }
            status = response.status;
            statusText = response.statusText;
            return response;
        })
        .then(response => response.text())
        .then(text => {
            body = text;
            try {
                json = JSON.parse(text);
            } catch (e) {
                // not json, no big deal
            }
            if (status < 200 || status >= 300) {
                return Promise.reject(new Error((json && json.message) || statusText));
            }
            return { status, headers, body, json };
        });
};

export const queryParameters = (data) => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
