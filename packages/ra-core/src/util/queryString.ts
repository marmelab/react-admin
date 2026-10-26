import queryString from 'query-string';

export type { ParseOptions, StringifyOptions, ParsedQuery } from 'query-string';
export const parse = queryString.parse;
export const stringify = queryString.stringify;
