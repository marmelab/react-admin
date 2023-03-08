import HttpError from './HttpError';
import { stringify } from 'query-string';

export interface Options extends RequestInit {
    user?: {
        authenticated?: boolean;
        token?: string;
    };
}

export const createHeadersFromOptions = (options: Options): Headers => {
    const requestHeaders = (options.headers ||
        new Headers({
            Accept: 'application/json',
        })) as Headers;
    if (
        !requestHeaders.has('Content-Type') &&
        !(options && (!options.method || options.method === 'GET')) &&
        !(options && options.body && options.body instanceof FormData)
    ) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (options.user && options.user.authenticated && options.user.token) {
        requestHeaders.set('Authorization', options.user.token);
    }

    return requestHeaders;
};

/**
 * Utility function to make HTTP calls. It's similar to the HTML5 `fetch()`, except it handles JSON decoding and HTTP error codes automatically.
 *
 * @param url the URL to call
 * @param options the options to pass to the HTTP call
 * @param options.user the user object, used for the Authorization header
 * @param options.user.token the token to pass as the Authorization header
 * @param options.user.authenticated whether the user is authenticated or not (the Authorization header will be set only if this is true)
 * @param options.headers the headers to pass to the HTTP call
 *
 * @returns {Promise} the Promise for a response object containing the following properties:
 * - status: the HTTP status code
 * - headers: the HTTP headers
 * - body: the response body
 * - json: the response body parsed as JSON
 */
export const fetchJson = (url, options: Options = {}) => {
    const requestHeaders = createHeadersFromOptions(options);

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
            return Promise.resolve({ status, headers, body, json });
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
