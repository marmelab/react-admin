export function hasOtherFiltersThanDefault(
    filterValues: { [key: string]: any },
    defaultFilterKey: string,
    defaultFilterValue: unknown
): boolean {
    return Object.keys(filterValues).some(
        key =>
            key !== defaultFilterKey || filterValues[key] !== defaultFilterValue
    );
}
