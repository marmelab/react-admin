import { useCallback } from 'react';

import useGetList from '../../dataProvider/useGetList';
import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import useTranslate from '../../i18n/useTranslate';
import {
    PaginationPayload,
    Record,
    RecordMap,
    Identifier,
    SortPayload,
} from '../../types';
import { ListControllerProps } from '../useListController';
import useReference from '../useReference';
import usePaginationState from '../usePaginationState';
import { useSortState } from '..';
import useFilterState from '../useFilterState';
import useSelectionState from '../useSelectionState';
import { useResourceContext } from '../../core';
import { Refetch } from '../../dataProvider';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;
const defaultFilter = {};

/**
 * A hook for choosing a reference record. Useful for foreign keys.
 *
 * This hook fetches the possible values in the reference resource
 * (using `dataProvider.getList()`), it returns the possible choices
 * as the `choices` attribute.
 *
 * @example
 * const {
 *      choices, // the available reference resource
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 * });
 *
 * The hook also allow to filter results. It returns a `setFilter`
 * function. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function option
 * You can also add a permanentFilter to further filter the result:
 *
 * @example
 * const {
 *      choices, // the available reference resource
 *      setFilter,
 * } = useReferenceInputController({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 *      permanentFilter: {
 *          author: 'john'
 *      },
 *      filterToQuery: searchText => ({ title: searchText })
 * });
 */
export const useReferenceInputController = (
    props: Option
): ReferenceInputValue => {
    const {
        basePath,
        input,
        page: initialPage = 1,
        perPage: initialPerPage = 25,
        filter = defaultFilter,
        reference,
        filterToQuery,
        sort: sortOverride,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();

    // pagination logic
    const {
        pagination,
        setPagination,
        page,
        setPage,
        perPage,
        setPerPage,
    } = usePaginationState({ page: initialPage, perPage: initialPerPage });

    // sort logic
    const { sort, setSort: setSortObject } = useSortState(sortOverride);
    const setSort = useCallback(
        (field: string, order: string = 'ASC') => {
            setSortObject({ field, order });
            setPage(1);
        },
        [setPage, setSortObject]
    );

    // filter logic
    const { filter: filterValues, setFilter } = useFilterState({
        permanentFilter: filter,
        filterToQuery,
    });
    const displayedFilters = [];
    // plus showFilter and hideFilter defined outside of the hook because
    // they never change

    // selection logic
    const {
        selectedIds,
        onSelect,
        onToggleItem,
        onUnselectItems,
    } = useSelectionState();

    // fetch possible values
    const {
        ids: possibleValuesIds,
        data: possibleValuesData,
        total: possibleValuesTotal,
        loaded: possibleValuesLoaded,
        loading: possibleValuesLoading,
        error: possibleValuesError,
        refetch: refetchGetList,
    } = useGetList(reference, pagination, sort, filterValues);

    // fetch current value
    const {
        referenceRecord,
        refetch: refetchReference,
        error: referenceError,
        loading: referenceLoading,
        loaded: referenceLoaded,
    } = useReference({
        id: input.value,
        reference,
    });

    // add current value to possible sources
    let finalIds: Identifier[],
        finalData: RecordMap<Record>,
        finalTotal: number;
    if (!referenceRecord || possibleValuesIds.includes(input.value)) {
        finalIds = possibleValuesIds;
        finalData = possibleValuesData;
        finalTotal = possibleValuesTotal;
    } else {
        finalIds = [input.value, ...possibleValuesIds];
        finalData = { [input.value]: referenceRecord, ...possibleValuesData };
        finalTotal = possibleValuesTotal + 1;
    }

    // overall status
    const dataStatus = getDataStatus({
        input,
        matchingReferences: Object.keys(finalData).map(id => finalData[id]),
        referenceRecord,
        translate,
    });

    const refetch = useCallback(() => {
        refetchGetList();
        refetchReference();
    }, [refetchGetList, refetchReference]);

    return {
        // should match the ListContext shape
        possibleValues: {
            basePath,
            data: finalData,
            ids: finalIds,
            total: finalTotal,
            error: possibleValuesError,
            loaded: possibleValuesLoaded,
            loading: possibleValuesLoading,
            hasCreate: false,
            page,
            setPage,
            perPage,
            setPerPage,
            currentSort: sort,
            setSort,
            filterValues,
            displayedFilters,
            setFilters: setFilter,
            showFilter,
            hideFilter,
            selectedIds,
            onSelect,
            onToggleItem,
            onUnselectItems,
            refetch,
            resource,
        },
        referenceRecord: {
            data: referenceRecord,
            loaded: referenceLoaded,
            loading: referenceLoading,
            error: referenceError,
            refetch: refetchReference,
        },
        dataStatus: {
            error: dataStatus.error,
            loading: dataStatus.waiting,
            warning: dataStatus.warning,
        },
        choices: finalIds.map(id => finalData[id]),
        // kept for backwards compatibility
        // @deprecated to be removed in 4.0
        error: dataStatus.error,
        loading: possibleValuesLoading || referenceLoading,
        loaded: possibleValuesLoaded && referenceLoaded,
        filter: filterValues,
        refetch,
        setFilter,
        pagination,
        setPagination,
        sort,
        setSort: setSortObject,
        warning: dataStatus.warning,
    };
};

const hideFilter = () => {};
const showFilter = () => {};

export interface ReferenceInputValue {
    possibleValues: ListControllerProps;
    referenceRecord: {
        data?: Record;
        loaded: boolean;
        loading: boolean;
        error?: any;
        refetch: Refetch;
    };
    dataStatus: {
        error?: any;
        loading: boolean;
        warning?: string;
    };
    choices: Record[];
    error?: string;
    loaded: boolean;
    loading: boolean;
    pagination: PaginationPayload;
    setFilter: (filter: string) => void;
    filter: any;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
    sort: SortPayload;
    warning?: string;
    refetch: Refetch;
}

interface Option {
    allowEmpty?: boolean;
    basePath?: string;
    filter?: any;
    filterToQuery?: (filter: string) => any;
    input?: any;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    // @deprecated ignored
    referenceSource?: typeof defaultReferenceSource;
    resource?: string;
    sort?: SortPayload;
    source: string;
}
