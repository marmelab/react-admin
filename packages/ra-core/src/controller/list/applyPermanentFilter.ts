import { FilterPayload } from '../../types';

/**
 * Merge the user filter values with the permanent filter.
 *
 * The permanent filter keys come last, so that they win even in data providers
 * that map several keys to the same parameter (e.g. 'author.id' and { author: { id } }).
 */
export const applyPermanentFilter = (
    filterValues: FilterPayload | null | undefined,
    permanentFilter: FilterPayload | null | undefined
): FilterPayload => {
    const permanentKeys = Object.keys(permanentFilter ?? {});
    return {
        ...Object.fromEntries(
            Object.entries(filterValues ?? {}).filter(
                ([key]) => !permanentKeys.includes(key)
            )
        ),
        ...permanentFilter,
    };
};
