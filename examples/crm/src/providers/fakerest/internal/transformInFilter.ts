import { LIST_REGEX_BASE, parseList } from './listParser';

export const IN_FILTER_REGEX = new RegExp(`^\\(${LIST_REGEX_BASE}\\)$`);

export function transformInFilter(value: any) {
    if (value === '()') {
        return [];
    }

    if (typeof value !== 'string' || !value.match(IN_FILTER_REGEX)) {
        throw new Error(
            `Invalid '@in' filter value, expected a string matching '${IN_FILTER_REGEX.source}', got: ${value}`
        );
    }

    return parseList(value.slice(1, -1));
}
