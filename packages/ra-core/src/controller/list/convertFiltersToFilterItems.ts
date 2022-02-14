import { FilterPayload, FilterItem } from '../../types';

export const convertFiltersToFilterItems = (
    filters: FilterItem[] | FilterPayload
): FilterItem[] => {
    if (filters == null) return emptyArray;
    if (Array.isArray(filters)) {
        return filters;
    }
    return Object.keys(filters).map(key => ({
        field: key,
        value: filters[key],
    }));
};

const emptyArray = [];
