import HttpError from './HttpError';
import { stringify } from 'query-string';

export const fetchJson = (url, options = {}) => {
    const requestHeaders =
        options.headers ||
        new Headers({
            Accept: 'application/json',
        });
    if (
        !requestHeaders.has('Content-Type') &&
        !(options && options.body && options.body instanceof FormData)
    ) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (options.user && options.user.authenticated && options.user.token) {
        requestHeaders.set('Authorization', options.user.token);
    }

    return fetch(url, { ...options, headers: requestHeaders })
        .then(response =>
            response.text().then(text => ({
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: text,
            }))
        )
        .then(({ status, statusText, headers, body }) => {
            let json;
            try {
                json = JSON.parse(body);
            } catch (e) {
                // not json, no big deal
            }
            if (status < 200 || status >= 300) {
                return Promise.reject(
                    new HttpError(
                        (json && json.message) || statusText,
                        status,
                        json
                    )
                );
            }
            return { status, headers, body, json };
        });
};

export const queryParameters = stringify;

const isValidObject = value => {
    if (!value) {
        return false;
    }

    const isArray = Array.isArray(value);
    const isBuffer = typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
    const isObject =
        Object.prototype.toString.call(value) === '[object Object]';
    const hasKeys = !!Object.keys(value).length;

    return !isArray && !isBuffer && isObject && hasKeys;
};

export const flattenObject = (value, path = []) => {
    if (isValidObject(value)) {
        return Object.assign(
            {},
            ...Object.keys(value).map(key =>
                flattenObject(value[key], path.concat([key]))
            )
        );
    } else {
        return path.length ? { [path.join('.')]: value } : value;
    }
};
