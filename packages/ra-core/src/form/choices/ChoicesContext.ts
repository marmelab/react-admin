import { createContext } from 'react';
import { FilterPayload, RaRecord, SortPayload } from '../../types';

/**
 * Context to store choices and functions to retrieve them.
 *
 * Use the useChoicesContext() hook to read the context.
 */
export const ChoicesContext = createContext<ChoicesContextValue>(undefined);

export type ChoicesContextValue<RecordType extends RaRecord = any> = {
    sort: SortPayload;
    data: RecordType[];
    displayedFilters: any;
    error?: any;
    filter?: FilterPayload;
    filterValues: any;
    hideFilter: (filterName: string) => void;
    isFetching: boolean;
    isLoading: boolean;
    page: number;
    perPage: number;
    refetch: () => void;
    resource: string;
    setFilters: (
        filters: any,
        displayedFilters: any,
        debounce?: boolean
    ) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: SortPayload) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    source: string;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};
