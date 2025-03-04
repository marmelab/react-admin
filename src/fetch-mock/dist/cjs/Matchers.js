"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtInMatchers = exports.isFunctionMatcher = exports.isUrlMatcher = void 0;
const glob_to_regexp_1 = __importDefault(require("glob-to-regexp"));
const regexparam = __importStar(require("regexparam"));
const IsSubsetOf_js_1 = require("./IsSubsetOf.js");
const dequal_1 = require("dequal");
const RequestUtils_js_1 = require("./RequestUtils.js");
const isUrlMatcher = (matcher) => matcher instanceof RegExp ||
    typeof matcher === 'string' ||
    (typeof matcher === 'object' && 'href' in matcher);
exports.isUrlMatcher = isUrlMatcher;
const isFunctionMatcher = (matcher) => typeof matcher === 'function';
exports.isFunctionMatcher = isFunctionMatcher;
const stringMatchers = {
    begin: (targetString) => ({ url }) => url.startsWith(targetString),
    end: (targetString) => ({ url }) => url.endsWith(targetString),
    include: (targetString) => ({ url }) => url.includes(targetString),
    glob: (targetString) => {
        const urlRX = (0, glob_to_regexp_1.default)(targetString);
        return ({ url }) => urlRX.test(url);
    },
    express: (targetString) => {
        const urlRX = regexparam.parse(targetString);
        return (callLog) => {
            const vals = urlRX.pattern.exec((0, RequestUtils_js_1.getPath)(callLog.url));
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
        const dotlessTargetString = (0, RequestUtils_js_1.getPath)(targetString);
        return ({ url }) => {
            const path = (0, RequestUtils_js_1.getPath)(url);
            return path === targetString || path === dotlessTargetString;
        };
    },
};
const getHeaderMatcher = ({ headers: expectedHeaders }) => {
    if (!expectedHeaders) {
        return;
    }
    const expectation = (0, RequestUtils_js_1.normalizeHeaders)(expectedHeaders);
    return ({ options: { headers = {} } }) => {
        const lowerCaseHeaders = (0, RequestUtils_js_1.normalizeHeaders)(headers);
        return Object.keys(expectation).every((headerName) => lowerCaseHeaders[headerName] === expectation[headerName]);
    };
};
const getMissingHeaderMatcher = ({ missingHeaders: expectedMissingHeaders, }) => {
    if (!expectedMissingHeaders) {
        return;
    }
    const expectation = expectedMissingHeaders.map((header) => header.toLowerCase());
    return ({ options: { headers = {} } }) => {
        const lowerCaseHeaders = (0, RequestUtils_js_1.normalizeHeaders)(headers);
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
            return (0, dequal_1.dequal)(actualValues, expectedValues);
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
                ? (0, IsSubsetOf_js_1.isSubsetOf)(expectedBody, sentBody)
                : (0, dequal_1.dequal)(expectedBody, sentBody)));
    };
};
const getFunctionMatcher = ({ matcherFunction }) => matcherFunction;
const getRegexpMatcher = (regexp) => ({ url }) => regexp.test(url);
const getFullUrlMatcher = (route, matcherUrl, query) => {
    const expectedUrl = (0, RequestUtils_js_1.normalizeUrl)(matcherUrl, route.allowRelativeUrls);
    if (route.url === matcherUrl) {
        route.url = expectedUrl;
    }
    return ({ url }) => {
        if (query && expectedUrl.indexOf('?')) {
            return (0, RequestUtils_js_1.getPath)(url) === (0, RequestUtils_js_1.getPath)(expectedUrl);
        }
        return (0, RequestUtils_js_1.normalizeUrl)(url, true) === expectedUrl;
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
exports.builtInMatchers = [
    { name: 'url', matcher: getUrlMatcher },
    { name: 'query', matcher: getQueryParamsMatcher },
    { name: 'method', matcher: getMethodMatcher },
    { name: 'headers', matcher: getHeaderMatcher },
    { name: 'missingHeaders', matcher: getMissingHeaderMatcher },
    { name: 'params', matcher: getExpressParamsMatcher },
    { name: 'body', matcher: getBodyMatcher, usesBody: true },
    { name: 'matcherFunction', matcher: getFunctionMatcher },
];
