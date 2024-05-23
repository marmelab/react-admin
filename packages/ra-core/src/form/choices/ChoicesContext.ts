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

export type ChoicesContextBaseValue<RecordType extends RaRecord = any> = {
    displayedFilters: any;
    filter?: FilterPayload;
    filterValues: any;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    hideFilter: (filterName: string) => void;
    isFetching: boolean;
    isLoading: boolean;
    page: number;
    perPage: number;
    refetch: (() => void) | UseGetListHookValue<RecordType>['refetch'];
    resource: string;
    setFilters: (
        filters: any,
        displayedFilters?: any,
        debounce?: boolean
    ) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: SortPayload) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    sort: SortPayload;
    source: string;
    isFromReference: boolean;
};

export interface ChoicesContextLoadingResult<RecordType extends RaRecord = any>
    extends ChoicesContextBaseValue<RecordType> {
    allChoices: undefined;
    availableChoices: undefined;
    selectedChoices: undefined;
    total: undefined;
    error: null;
    isPending: true;
}
export interface ChoicesContextErrorResult<
    RecordType extends RaRecord = any,
    TError = Error,
> extends ChoicesContextBaseValue<RecordType> {
    allChoices: undefined;
    availableChoices: undefined;
    selectedChoices: undefined;
    total: undefined;
    error: TError;
    isPending: false;
}
export interface ChoicesContextRefetchErrorResult<
    RecordType extends RaRecord = any,
    TError = Error,
> extends ChoicesContextBaseValue<RecordType> {
    allChoices: RecordType[];
    availableChoices: RecordType[];
    selectedChoices: RecordType[];
    total: number;
    error: TError;
    isPending: false;
}
export interface ChoicesContextSuccessResult<RecordType extends RaRecord = any>
    extends ChoicesContextBaseValue<RecordType> {
    allChoices: RecordType[];
    availableChoices: RecordType[];
    selectedChoices: RecordType[];
    total: number;
    error: null;
    isPending: false;
}

export type ChoicesContextValue<RecordType extends RaRecord = any> =
    | ChoicesContextLoadingResult<RecordType>
    | ChoicesContextErrorResult<RecordType>
    | ChoicesContextRefetchErrorResult<RecordType>
    | ChoicesContextSuccessResult<RecordType>;
