import { SortPayload, useStore } from 'ra-core';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSavedQueries = (resource: string) => {
    return useStore<SavedQuery[]>(`${resource}.savedQueries`, []);
};

export interface SavedQuery {
    label: string;
    value: {
        filter?: any;
        displayedFilters?: any[];
        sort?: SortPayload;
        perPage?: number;
    };
}

export const extractValidSavedQueries = (savedQueries: SavedQuery[]) => {
    if (Array.isArray(savedQueries)) {
        return savedQueries.filter(query => isValidSavedQuery(query));
    }

    return [];
};

export const areValidSavedQueries = (savedQueries: SavedQuery[]) => {
    if (
        Array.isArray(savedQueries) &&
        savedQueries.every(query => isValidSavedQuery(query))
    ) {
        return true;
    }
};

export const isValidSavedQuery = (savedQuery: SavedQuery) => {
    if (
        savedQuery.label &&
        typeof savedQuery.label === 'string' &&
        savedQuery.value &&
        typeof Array.isArray(savedQuery.value.displayedFilters) &&
        typeof savedQuery.value.perPage === 'number' &&
        typeof savedQuery.value.sort?.field === 'string' &&
        typeof savedQuery.value.sort?.order === 'string' &&
        typeof savedQuery.value.filter === 'object'
    ) {
        return true;
    }

    return false;
};
