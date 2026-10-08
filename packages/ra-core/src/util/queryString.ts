import { parse, stringify, type StringifyOptions } from './vendor/queryString';

export type ParsedQuery = Record<string, string | null | (string | null)[]>;

/**
 * Serialize an object into a query string, using a vendored copy of `query-string`.
 * @see https://github.com/marmelab/react-admin/issues/11380
 *
 * @example
 * stringifyQueryString({ page: 1, sort: 'id', ids: [1, 2] });
 * // 'ids=1&ids=2&page=1&sort=id'
 */
export const stringifyQueryString = (
    object: Record<string, any> | null | undefined,
    options?: StringifyOptions
): string => stringify(object, options);

/**
 * Parse a query string into an object without prototype, using a vendored copy of `query-string`.
 * @see https://github.com/marmelab/react-admin/issues/11380
 *
 * @example
 * parseQueryString('?page=1&sort=id&ids=1&ids=2');
 * // { ids: ['1', '2'], page: '1', sort: 'id' }
 */
export const parseQueryString = (query: string): ParsedQuery => parse(query);
