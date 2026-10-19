/**
 * Vendored from query-string@9.5.1 (https://github.com/sindresorhus/query-string)
 * Source: base.js at tag v9.5.1
 *
 * react-admin used query-string@7, which depends on a vulnerable version of
 * decode-uri-component, and query-string@8+ is ESM-only, so it can't be used
 * by the ra-core CJS build.
 * @see https://github.com/marmelab/react-admin/issues/11380
 *
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Modifications:
 * - Converted to TypeScript: added the `ArrayFormat`, `ParseOptions` and
 *   `StringifyOptions` types (adapted from the upstream base.d.ts) and typed
 *   overload signatures for `parse()` and `stringify()`. The function bodies
 *   and private helpers are left untyped, except for an `any[]` annotation on
 *   the `splitOnFirst()` destructuring in `parse()` (needed with
 *   strictNullChecks).
 * - Kept only `parse()` and `stringify()` and the private helpers they use.
 *   Removed `extract()`, `parseUrl()`, `stringifyUrl()`, `pick()`, `exclude()`,
 *   and the `removeHash()`, `getHash()`, `getUrlWithoutQuery()` helpers and the
 *   `encodeFragmentIdentifier` symbol that only they used.
 * - Imports the vendored `decodeUriComponent` and `splitOnFirst` (named
 *   exports) instead of the decode-uri-component and split-on-first packages.
 *   The filter-obj import is removed (only `pick()` used it).
 * - Replaced `String.prototype.replaceAll()` (ES2021, not in the ES2020 lib
 *   used by react-admin) with equivalent `replace()` calls using global regexes:
 *   `.replaceAll(/[!'()*]/g, ...)` in `strictUriEncode()` and
 *   `.replaceAll('+', ' ')` in `parse()`.
 * - Removed the `eslint-disable-next-line unicorn/...` comments (the unicorn
 *   ESLint plugin is not used in this repo).
 * - Reformatted with the repo Prettier config.
 */
import { decodeUriComponent } from './decodeUriComponent';
import { splitOnFirst } from './splitOnFirst';

export type ArrayFormat =
    | 'none'
    | 'bracket'
    | 'index'
    | 'comma'
    | 'separator'
    | 'bracket-separator'
    | 'colon-list-separator';

export type ParseOptions = {
    readonly decode?: boolean;
    readonly arrayFormat?: ArrayFormat;
    readonly arrayFormatSeparator?: string;
    readonly sort?: ((itemLeft: string, itemRight: string) => number) | false;
    readonly parseNumbers?: boolean;
    readonly parseBooleans?: boolean;
    readonly types?: Record<
        string,
        | 'boolean'
        | 'number'
        | 'string'
        | 'string[]'
        | 'number[]'
        | ((value: string) => unknown)
    >;
};

export type StringifyOptions = {
    readonly strict?: boolean;
    readonly encode?: boolean;
    readonly arrayFormat?: ArrayFormat;
    readonly arrayFormatSeparator?: string;
    readonly sort?: ((itemLeft: string, itemRight: string) => number) | false;
    readonly skipNull?: boolean;
    readonly skipEmptyString?: boolean;
    readonly replacer?: (key: string, value: unknown) => unknown;
};

const isNullOrUndefined = value => value === null || value === undefined;

const strictUriEncode = string =>
    encodeURIComponent(string).replace(
        /[!'()*]/g,
        x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`
    );

function encoderForArrayFormat(options) {
    switch (options.arrayFormat) {
        case 'index': {
            return key => (result, value) => {
                const index = result.length;

                if (
                    value === undefined ||
                    (options.skipNull && value === null) ||
                    (options.skipEmptyString && value === '')
                ) {
                    return result;
                }

                if (value === null) {
                    result.push(
                        [encode(key, options), '[', index, ']'].join('')
                    );
                    return result;
                }

                result.push(
                    [
                        encode(key, options),
                        '[',
                        encode(index, options),
                        ']=',
                        encode(value, options),
                    ].join('')
                );
                return result;
            };
        }

        case 'bracket': {
            return key => (result, value) => {
                if (
                    value === undefined ||
                    (options.skipNull && value === null) ||
                    (options.skipEmptyString && value === '')
                ) {
                    return result;
                }

                if (value === null) {
                    result.push([encode(key, options), '[]'].join(''));
                    return result;
                }

                result.push(
                    [encode(key, options), '[]=', encode(value, options)].join(
                        ''
                    )
                );
                return result;
            };
        }

        case 'colon-list-separator': {
            return key => (result, value) => {
                if (
                    value === undefined ||
                    (options.skipNull && value === null) ||
                    (options.skipEmptyString && value === '')
                ) {
                    return result;
                }

                if (value === null) {
                    result.push([encode(key, options), ':list='].join(''));
                    return result;
                }

                result.push(
                    [
                        encode(key, options),
                        ':list=',
                        encode(value, options),
                    ].join('')
                );
                return result;
            };
        }

        case 'comma':
        case 'separator':
        case 'bracket-separator': {
            const keyValueSeparator =
                options.arrayFormat === 'bracket-separator' ? '[]=' : '=';

            return key => (result, value) => {
                if (
                    value === undefined ||
                    (options.skipNull && value === null) ||
                    (options.skipEmptyString && value === '')
                ) {
                    return result;
                }

                // Translate null to an empty string so that it doesn't serialize as 'null'
                value = value === null ? '' : value;

                if (result.length === 0) {
                    result.push(
                        [
                            encode(key, options),
                            keyValueSeparator,
                            encode(value, options),
                        ].join('')
                    );
                    return result;
                }

                result.push(encode(value, options));
                return result;
            };
        }

        default: {
            return key => (result, value) => {
                if (
                    value === undefined ||
                    (options.skipNull && value === null) ||
                    (options.skipEmptyString && value === '')
                ) {
                    return result;
                }

                if (value === null) {
                    result.push(encode(key, options));
                    return result;
                }

                result.push(
                    [encode(key, options), '=', encode(value, options)].join('')
                );
                return result;
            };
        }
    }
}

function parserForArrayFormat(options) {
    let result;

    switch (options.arrayFormat) {
        case 'index': {
            return (key, value, accumulator) => {
                result = /\[(\d*)]$/.exec(key);

                key = key.replace(/\[\d*]$/, '');

                if (!result) {
                    accumulator[key] = value;
                    return;
                }

                if (accumulator[key] === undefined) {
                    accumulator[key] = {};
                }

                accumulator[key][result[1]] = value;
            };
        }

        case 'bracket': {
            return (key, value, accumulator) => {
                result = /(\[])$/.exec(key);
                key = key.replace(/\[]$/, '');

                if (!result) {
                    accumulator[key] = value;
                    return;
                }

                if (accumulator[key] === undefined) {
                    accumulator[key] = [value];
                    return;
                }

                if (!Array.isArray(accumulator[key])) {
                    accumulator[key] = [accumulator[key], value];
                    return;
                }

                accumulator[key].push(value);
            };
        }

        case 'colon-list-separator': {
            return (key, value, accumulator) => {
                result = /(:list)$/.exec(key);
                key = key.replace(/:list$/, '');

                if (!result) {
                    accumulator[key] = value;
                    return;
                }

                if (accumulator[key] === undefined) {
                    accumulator[key] = [value];
                    return;
                }

                if (!Array.isArray(accumulator[key])) {
                    accumulator[key] = [accumulator[key], value];
                    return;
                }

                accumulator[key].push(value);
            };
        }

        case 'comma':
        case 'separator': {
            return (key, value, accumulator) => {
                const isArray =
                    typeof value === 'string' &&
                    value.includes(options.arrayFormatSeparator);
                const newValue = isArray
                    ? value
                          .split(options.arrayFormatSeparator)
                          .map(item => decode(item, options))
                    : value === null
                      ? value
                      : decode(value, options);
                accumulator[key] = newValue;
            };
        }

        case 'bracket-separator': {
            return (key, value, accumulator) => {
                const isArray = /(\[])$/.test(key);
                key = key.replace(/\[]$/, '');

                if (!isArray) {
                    accumulator[key] = value ? decode(value, options) : value;
                    return;
                }

                const arrayValue =
                    value === null
                        ? []
                        : decode(value, options).split(
                              options.arrayFormatSeparator
                          );

                if (accumulator[key] === undefined) {
                    accumulator[key] = arrayValue;
                    return;
                }

                if (!Array.isArray(accumulator[key])) {
                    accumulator[key] = [accumulator[key]];
                }

                for (const item of arrayValue) {
                    accumulator[key].push(item);
                }
            };
        }

        default: {
            return (key, value, accumulator) => {
                if (accumulator[key] === undefined) {
                    accumulator[key] = value;
                    return;
                }

                if (Array.isArray(accumulator[key])) {
                    accumulator[key].push(value);
                    return;
                }

                accumulator[key] = [accumulator[key], value];
            };
        }
    }
}

function validateArrayFormatSeparator(value) {
    if (typeof value !== 'string' || value.length !== 1) {
        throw new TypeError(
            'arrayFormatSeparator must be single character string'
        );
    }
}

function encode(value, options) {
    if (options.encode) {
        return options.strict
            ? strictUriEncode(value)
            : encodeURIComponent(value);
    }

    return value;
}

function decode(value, options) {
    if (options.decode) {
        return decodeUriComponent(value);
    }

    return value;
}

function keysSorter(input) {
    if (Array.isArray(input)) {
        return input.sort();
    }

    if (typeof input === 'object') {
        return keysSorter(Object.keys(input))
            .sort((a, b) => Number(a) - Number(b))
            .map(key => input[key]);
    }

    return input;
}

function parseValue(value, options, type) {
    if (type === 'string' && typeof value === 'string') {
        return value;
    }

    if (typeof type === 'function' && typeof value === 'string') {
        return type(value);
    }

    if (type === 'boolean' && value === null) {
        return true;
    }

    if (
        type === 'boolean' &&
        value !== null &&
        (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')
    ) {
        return value.toLowerCase() === 'true';
    }

    if (
        type === 'boolean' &&
        value !== null &&
        (value.toLowerCase() === '1' || value.toLowerCase() === '0')
    ) {
        return value.toLowerCase() === '1';
    }

    if (
        type === 'string[]' &&
        options.arrayFormat !== 'none' &&
        typeof value === 'string'
    ) {
        return [value];
    }

    if (
        type === 'number[]' &&
        options.arrayFormat !== 'none' &&
        !Number.isNaN(Number(value)) &&
        typeof value === 'string' &&
        value.trim() !== ''
    ) {
        return [Number(value)];
    }

    if (
        type === 'number' &&
        !Number.isNaN(Number(value)) &&
        typeof value === 'string' &&
        value.trim() !== ''
    ) {
        return Number(value);
    }

    if (
        options.parseBooleans &&
        value !== null &&
        (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')
    ) {
        return value.toLowerCase() === 'true';
    }

    if (
        options.parseNumbers &&
        !Number.isNaN(Number(value)) &&
        typeof value === 'string' &&
        value.trim() !== ''
    ) {
        return Number(value);
    }

    return value;
}

export function parse(
    query: string,
    options?: ParseOptions
): Record<string, any>;
export function parse(query, options) {
    options = {
        decode: true,
        sort: true,
        arrayFormat: 'none',
        arrayFormatSeparator: ',',
        parseNumbers: false,
        parseBooleans: false,
        types: Object.create(null),
        ...options,
    };

    validateArrayFormatSeparator(options.arrayFormatSeparator);

    const formatter = parserForArrayFormat(options);

    // Create an object with no prototype
    const returnValue = Object.create(null);

    if (typeof query !== 'string') {
        return returnValue;
    }

    query = query.trim().replace(/^[?#&]/, '');

    if (!query) {
        return returnValue;
    }

    if (/^&+$/.test(query)) {
        return returnValue;
    }

    let parameterStart = 0;
    let firstSeparator = query.indexOf('&');
    if (firstSeparator === -1) {
        firstSeparator = query.length;
    }

    for (let index = firstSeparator; index <= query.length; index++) {
        if (index < query.length && query[index] !== '&') {
            continue;
        }

        if (index === parameterStart) {
            parameterStart = index + 1;
            continue;
        }

        const parameter = query.slice(parameterStart, index);
        const parameter_ = options.decode
            ? parameter.replace(/\+/g, ' ')
            : parameter;

        let [key, value]: any[] = splitOnFirst(parameter_, '=');

        if (key === undefined) {
            key = parameter_;
        }

        // Missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        value =
            value === undefined
                ? null
                : ['comma', 'separator', 'bracket-separator'].includes(
                        options.arrayFormat
                    )
                  ? value
                  : decode(value, options);
        formatter(decode(key, options), value, returnValue);

        parameterStart = index + 1;
    }

    for (const [key, value] of Object.entries(returnValue)) {
        if (
            typeof value === 'object' &&
            value !== null &&
            options.types[key] !== 'string'
        ) {
            for (const [key2, value2] of Object.entries(value)) {
                const typeOption = options.types[key];
                const type =
                    typeof typeOption === 'function'
                        ? typeOption
                        : typeOption
                          ? typeOption.replace('[]', '')
                          : undefined;
                value[key2] = parseValue(value2, options, type);
            }
        } else if (
            typeof value === 'object' &&
            value !== null &&
            options.types[key] === 'string'
        ) {
            returnValue[key] = Object.values(value).join(
                options.arrayFormatSeparator
            );
        } else {
            returnValue[key] = parseValue(value, options, options.types[key]);
        }
    }

    if (options.sort === false) {
        return returnValue;
    }

    // TODO: Remove the use of `reduce`.
    return (
        options.sort === true
            ? Object.keys(returnValue).sort()
            : Object.keys(returnValue).sort(options.sort)
    ).reduce((result, key) => {
        const value = returnValue[key];
        result[key] =
            Boolean(value) && typeof value === 'object' && !Array.isArray(value)
                ? keysSorter(value)
                : value;
        return result;
    }, Object.create(null));
}

export function stringify(
    object: Record<string, any> | null | undefined,
    options?: StringifyOptions
): string;
export function stringify(object, options) {
    if (!object) {
        return '';
    }

    options = {
        encode: true,
        strict: true,
        arrayFormat: 'none',
        arrayFormatSeparator: ',',
        ...options,
    };

    validateArrayFormatSeparator(options.arrayFormatSeparator);

    const shouldFilter = key =>
        (options.skipNull && isNullOrUndefined(object[key])) ||
        (options.skipEmptyString && object[key] === '');

    const formatter = encoderForArrayFormat(options);

    const objectCopy = {};

    for (const [key, value] of Object.entries(object)) {
        if (!shouldFilter(key)) {
            objectCopy[key] = value;
        }
    }

    const keys = Object.keys(objectCopy);

    if (options.sort !== false) {
        keys.sort(options.sort);
    }

    return keys
        .map(key => {
            let value = object[key];

            // Apply replacer function if provided
            if (options.replacer) {
                value = options.replacer(key, value);

                // If replacer returns undefined, skip this key
                if (value === undefined) {
                    return '';
                }
            }

            if (value === undefined) {
                return '';
            }

            if (value === null) {
                return encode(key, options);
            }

            if (Array.isArray(value)) {
                if (
                    value.length === 0 &&
                    options.arrayFormat === 'bracket-separator'
                ) {
                    return encode(key, options) + '[]';
                }

                // Apply replacer to array elements if provided
                // Note: We don't re-apply replacer to the array itself, only to elements
                let processedArray = value;
                if (options.replacer) {
                    processedArray = value
                        .map((item, index) =>
                            options.replacer(`${key}[${index}]`, item)
                        )
                        .filter(item => item !== undefined);
                }

                const result = processedArray.reduce(formatter(key), []);
                const arrayFormatSeparator = [
                    'comma',
                    'separator',
                    'bracket-separator',
                ].includes(options.arrayFormat)
                    ? options.arrayFormatSeparator
                    : '&';
                return result.join(arrayFormatSeparator);
            }

            return encode(key, options) + '=' + encode(value, options);
        })
        .filter(x => x.length > 0)
        .join('&');
}
