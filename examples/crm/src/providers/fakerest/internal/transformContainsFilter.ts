import { LIST_REGEX_BASE, parseList } from './listParser';

export const CONTAINS_FILTER_REGEX = new RegExp(`^\\{${LIST_REGEX_BASE}\\}$`);

export function transformContainsFilter(value: any) {
    if (value === '{}') {
        return [];
    }

    if (typeof value !== 'string' || !value.match(CONTAINS_FILTER_REGEX)) {
        throw new Error(
            `Invalid '@cs' filter value, expected a string matching '${CONTAINS_FILTER_REGEX.source}', got: ${value}`
        );
    }

    return parseList(value.slice(1, -1));
}
