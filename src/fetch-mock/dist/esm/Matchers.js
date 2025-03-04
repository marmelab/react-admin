import glob from 'glob-to-regexp';
import * as regexparam from 'regexparam';
import { isSubsetOf } from './IsSubsetOf.js';
import { dequal as isEqual } from 'dequal';
import { normalizeHeaders, getPath, normalizeUrl } from './RequestUtils.js';
export const isUrlMatcher = (matcher) => matcher instanceof RegExp ||
    typeof matcher === 'string' ||
    (typeof matcher === 'object' && 'href' in matcher);
export const isFunctionMatcher = (matcher) => typeof matcher === 'function';
const stringMatchers = {
    begin: (targetString) => ({ url }) => url.startsWith(targetString),
    end: (targetString) => ({ url }) => url.endsWith(targetString),
    include: (targetString) => ({ url }) => url.includes(targetString),
    glob: (targetString) => {
        const urlRX = glob(targetString);
        return ({ url }) => urlRX.test(url);
    },
    express: (targetString) => {
        const urlRX = regexparam.parse(targetString);
        return (callLog) => {
            const vals = urlRX.pattern.exec(getPath(callLog.url));
            if (!vals) {
                callLog.expressParams = {};
                return false;
            }
            vals.shift();
            callLog.expressParams = urlRX.keys.reduce((map, paramName, i) => vals[i] ? Object.assign(map, { [paramName]: vals[i] }) : map, {});
            return true;
        };
    },
    path: (targetString) => {
        const dotlessTargetString = getPath(targetString);
        return ({ url }) => {
            const path = getPath(url);
            return path === targetString || path === dotlessTargetString;
        };
    },
};
const getHeaderMatcher = ({ headers: expectedHeaders }) => {
    if (!expectedHeaders) {
        return;
    }
    const expectation = normalizeHeaders(expectedHeaders);
    return ({ options: { headers = {} } }) => {
        const lowerCaseHeaders = normalizeHeaders(headers);
        return Object.keys(expectation).every((headerName) => lowerCaseHeaders[headerName] === expectation[headerName]);
    };
};
const getMissingHeaderMatcher = ({ missingHeaders: expectedMissingHeaders, }) => {
    if (!expectedMissingHeaders) {
        return;
    }
    const expectation = expectedMissingHeaders.map((header) => header.toLowerCase());
    return ({ options: { headers = {} } }) => {
        const lowerCaseHeaders = normalizeHeaders(headers);
        return expectation.every((headerName) => !(headerName in lowerCaseHeaders));
    };
};
const getMethodMatcher = ({ method: expectedMethod }) => {
    if (!expectedMethod) {
        return;
    }
    return ({ options: { method } = {} }) => {
        const actualMethod = method ? method.toLowerCase() : 'get';
        return expectedMethod === actualMethod;
    };
};
const getQueryParamsMatcher = ({ query: passedQuery }) => {
    if (!passedQuery) {
        return;
    }
    const expectedQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(passedQuery)) {
        if (Array.isArray(value)) {
            for (const item of value) {
                expectedQuery.append(key, typeof item === 'object' || typeof item === 'undefined'
                    ? ''
                    : item.toString());
            }
        }
        else {
            expectedQuery.append(key, typeof value === 'object' || typeof value === 'undefined'
                ? ''
                : value.toString());
        }
    }
    const keys = Array.from(expectedQuery.keys());
    return ({ queryParams }) => {
        return keys.every((key) => {
            const expectedValues = expectedQuery.getAll(key).sort();
            const actualValues = queryParams.getAll(key).sort();
            if (expectedValues.length !== actualValues.length) {
                return false;
            }
            if (Array.isArray(passedQuery[key])) {
                return expectedValues.every((expected, index) => expected === actualValues[index]);
            }
            return isEqual(actualValues, expectedValues);
        });
    };
};
const getExpressParamsMatcher = ({ params: expectedParams, url, }) => {
    if (!expectedParams) {
        return;
    }
    if (!(typeof url === 'string' && /express:/.test(url))) {
        throw new Error('fetch-mock: matching on params is only possible when using an express: matcher');
    }
    const expectedKeys = Object.keys(expectedParams);
    return ({ expressParams = {} }) => {
        return expectedKeys.every((key) => expressParams[key] === expectedParams[key]);
    };
};
const formDataToObject = (formData) => {
    const fields = [...formData];
    const result = {};
    fields.forEach(([key, value]) => {
        result[key] = result[key] || [];
        result[key].push(value);
    });
    return result;
};
const getBodyMatcher = (route) => {
    let { body: expectedBody } = route;
    let expectedBodyType = 'json';
    if (!expectedBody) {
        return;
    }
    if (expectedBody instanceof FormData) {
        expectedBodyType = 'formData';
        expectedBody = formDataToObject(expectedBody);
    }
    return ({ options: { body, method = 'get' } }) => {
        if (['get', 'head'].includes(method.toLowerCase())) {
            return false;
        }
        let sentBody;
        try {
            if (typeof body === 'string') {
                sentBody = JSON.parse(body);
                if (expectedBodyType !== 'json') {
                    return false;
                }
            }
        }
        catch { }
        if (body instanceof FormData) {
            if (expectedBodyType !== 'formData') {
                return false;
            }
            sentBody = formDataToObject(body);
        }
        return (sentBody &&
            (route.matchPartialBody
                ? isSubsetOf(expectedBody, sentBody)
                : isEqual(expectedBody, sentBody)));
    };
};
const getFunctionMatcher = ({ matcherFunction }) => matcherFunction;
const getRegexpMatcher = (regexp) => ({ url }) => regexp.test(url);
const getFullUrlMatcher = (route, matcherUrl, query) => {
    const expectedUrl = normalizeUrl(matcherUrl, route.allowRelativeUrls);
    if (route.url === matcherUrl) {
        route.url = expectedUrl;
    }
    return ({ url }) => {
        if (query && expectedUrl.indexOf('?')) {
            return getPath(url) === getPath(expectedUrl);
        }
        return normalizeUrl(url, true) === expectedUrl;
    };
};
const getUrlMatcher = (route) => {
    const { url: matcherUrl, query } = route;
    if (matcherUrl === '*') {
        return () => true;
    }
    if (matcherUrl instanceof RegExp) {
        return getRegexpMatcher(matcherUrl);
    }
    if (matcherUrl instanceof URL) {
        if (matcherUrl.href) {
            return getFullUrlMatcher(route, matcherUrl.href, query);
        }
    }
    if (typeof matcherUrl === 'string') {
        for (const shorthand in stringMatchers) {
            if (matcherUrl.indexOf(`${shorthand}:`) === 0) {
                const urlFragment = matcherUrl.replace(new RegExp(`^${shorthand}:`), '');
                return stringMatchers[shorthand](urlFragment);
            }
        }
        return getFullUrlMatcher(route, matcherUrl, query);
    }
    if (typeof matcherUrl === 'object') {
        const matchers = Object.entries(matcherUrl).map(([key, pattern]) => {
            if (key === 'regexp') {
                return getRegexpMatcher(pattern);
            }
            else if (key in stringMatchers) {
                return stringMatchers[key](pattern);
            }
            else {
                throw new Error(`unrecognised url matching pattern: ${key}`);
            }
        });
        return (route) => matchers.every((matcher) => matcher(route));
    }
};
export const builtInMatchers = [
    { name: 'url', matcher: getUrlMatcher },
    { name: 'query', matcher: getQueryParamsMatcher },
    { name: 'method', matcher: getMethodMatcher },
    { name: 'headers', matcher: getHeaderMatcher },
    { name: 'missingHeaders', matcher: getMissingHeaderMatcher },
    { name: 'params', matcher: getExpressParamsMatcher },
    { name: 'body', matcher: getBodyMatcher, usesBody: true },
    { name: 'matcherFunction', matcher: getFunctionMatcher },
];
