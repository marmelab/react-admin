export type ParsedQuery = Record<string, string | null | (string | null)[]>;

const strictEncode = (value: any): string =>
    encodeURIComponent(value).replace(
        /[!'()*]/g,
        char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );

const getUtf8SequenceLength = (leadByte: number): number =>
    leadByte >= 0xf0 ? 4 : leadByte >= 0xe0 ? 3 : leadByte >= 0xc0 ? 2 : 1;

const decodePercentEncodedRun = (run: string): string => {
    try {
        return decodeURIComponent(run);
    } catch {
        const bytes = run.match(/%[0-9a-f]{2}/gi) as string[];
        let result = '';
        let index = 0;
        while (index < bytes.length) {
            const length = getUtf8SequenceLength(
                parseInt(bytes[index].slice(1), 16)
            );
            try {
                result += decodeURIComponent(
                    bytes.slice(index, index + length).join('')
                );
                index += length;
            } catch {
                result += bytes[index];
                index += 1;
            }
        }
        return result;
    }
};

const safeDecode = (value: string): string => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value.replace(/(%[0-9a-f]{2})+/gi, decodePercentEncodedRun);
    }
};

/**
 * Serialize an object into a query string.
 *
 * Mirrors the default behavior of `query-string@7`'s `stringify()` (sorted keys,
 * strict URI encoding, `null` values as bare keys, `undefined` values skipped,
 * arrays as repeated keys). That dependency was removed because it pulled in
 * a vulnerable version of `decode-uri-component` and newer versions are ESM-only.
 * @see https://github.com/marmelab/react-admin/issues/11380
 *
 * @example
 * stringifyQueryString({ page: 1, sort: 'id', ids: [1, 2] });
 * // 'ids=1&ids=2&page=1&sort=id'
 */
export const stringifyQueryString = (
    object: Record<string, any> | null | undefined
): string => {
    if (!object) {
        return '';
    }

    const encodePair = (key: string, value: any) =>
        value === null
            ? strictEncode(key)
            : `${strictEncode(key)}=${strictEncode(value)}`;

    return Object.keys(object)
        .sort()
        .map(key => {
            const value = object[key];
            if (value === undefined) {
                return '';
            }
            if (Array.isArray(value)) {
                return value
                    .filter(item => item !== undefined)
                    .map(item => encodePair(key, item))
                    .join('&');
            }
            return encodePair(key, value);
        })
        .filter(part => part.length > 0)
        .join('&');
};

/**
 * Parse a query string into an object without prototype.
 *
 * Mirrors the default behavior of `query-string@7`'s `parse()` (sorted keys,
 * `+` decoded as a space, keys without `=` parsed as `null`, repeated keys
 * parsed as arrays, lenient decoding of malformed percent-encoded sequences).
 * That dependency was removed because it pulled in a vulnerable version of
 * `decode-uri-component` and newer versions are ESM-only.
 * @see https://github.com/marmelab/react-admin/issues/11380
 *
 * @example
 * parseQueryString('?page=1&sort=id&ids=1&ids=2');
 * // { ids: ['1', '2'], page: '1', sort: 'id' }
 */
export const parseQueryString = (query: string): ParsedQuery => {
    const parsed: ParsedQuery = Object.create(null);

    if (typeof query !== 'string') {
        return parsed;
    }

    for (const param of query
        .trim()
        .replace(/^[?#&]/, '')
        .split('&')) {
        if (param === '') {
            continue;
        }
        const normalizedParam = param.replace(/\+/g, ' ');
        const separatorIndex = normalizedParam.indexOf('=');
        const key = safeDecode(
            separatorIndex === -1
                ? normalizedParam
                : normalizedParam.slice(0, separatorIndex)
        );
        const value =
            separatorIndex === -1
                ? null
                : safeDecode(normalizedParam.slice(separatorIndex + 1));
        const previousValue = parsed[key];
        parsed[key] =
            previousValue === undefined
                ? value
                : ([] as (string | null)[]).concat(previousValue, value);
    }

    return Object.keys(parsed)
        .sort()
        .reduce(
            (sorted, key) => {
                sorted[key] = parsed[key];
                return sorted;
            },
            Object.create(null) as ParsedQuery
        );
};
