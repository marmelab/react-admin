import { createContext } from 'react';
import { UseGetListHookValue } from '../../dataProvider/useGetList';
import { FilterPayload, RaRecord, SortPayload } from '../../types';

/**
 * Context to store choices and functions to retrieve them.
 *
 * Use the useChoicesContext() hook to read the context.
 */
export const ChoicesContext = createContext<ChoicesContextValue | undefined>(
    undefined
);

export type ChoicesContextValue<RecordType extends RaRecord = any> = {
    allChoices: RecordType[];
    availableChoices: RecordType[];
    displayedFilters: any;
    error?: any;
    filter?: FilterPayload;
    filterValues: any;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    hideFilter: (filterName: string) => void;
    isFetching: boolean;
    isLoading: boolean;
    page: number;
    perPage: number;
    refetch: (() => void) | UseGetListHookValue<RecordType>['refetch'];
    resource: string;
    selectedChoices: RecordType[];
    setFilters: (
        filters: any,
        displayedFilters: any,
        debounce?: boolean
    ) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: SortPayload) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    sort: SortPayload;
    source: string;
    total: number;
    isFromReference: boolean;
};
