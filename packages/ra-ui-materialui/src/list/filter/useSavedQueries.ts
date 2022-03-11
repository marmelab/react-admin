import { SortPayload, useStore } from 'ra-core';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSavedQueries = (resource: string) =>
    useStore<SavedQuery[]>(`${resource}.savedQueries`, []);

export interface SavedQuery {
    label: string;
    value: {
        filter?: any;
        displayedFilters?: any[];
        sort?: SortPayload;
        perPage?: number;
    };
}
