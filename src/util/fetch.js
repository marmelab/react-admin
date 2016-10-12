export const fetchJson = (url, options = {}) => {
    const requestHeaders = new Headers({
        Accept: 'application/json',
    });
    if (!(options && options.body && options.body instanceof FormData)) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (options.user && options.user.authenticated && options.user.authenticated) {
        requestHeaders.set('Authorization', options.user.token);
    }

    return fetch(url, { ...options, headers: requestHeaders, credentials: 'include' })
        .then(response => response.text().then(text => ({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: text,
        })))
        .then(({ status, statusText, headers, body }) => {
            let json;
            try {
                json = JSON.parse(body);
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
