import { useCallback } from 'react';

import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import useTranslate from '../../i18n/useTranslate';
import { PaginationPayload, Record, SortPayload } from '../../types';
import { ListControllerProps } from '../useListController';
import useReference from '../useReference';
import useGetMatchingReferences from './useGetMatchingReferences';
import usePaginationState from '../usePaginationState';
import { useSortState } from '..';
import useFilterState from '../useFilterState';
import useSelectionState from '../useSelectionState';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;
const defaultFilter = {};

/**
 * A hook for choosing a reference record. Useful for foreign keys.
 *
 * This hook fetches the possible values in the reference resource
 * (using `dataProvider.getMatching()`), it returns the possible choices
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
const useReferenceInputController = ({
    basePath,
    input,
    page: initialPage = 1,
    perPage: initialPerPage = 25,
    filter = defaultFilter,
    reference,
    filterToQuery,
    referenceSource = defaultReferenceSource,
    resource,
    sort: sortOverride,
    source,
}: Option): ReferenceInputValue => {
    const translate = useTranslate();

    const {
        pagination,
        setPagination,
        page,
        setPage,
        perPage,
        setPerPage,
    } = usePaginationState({ page: initialPage, perPage: initialPerPage });

    const { sort, setSort: setSortObject } = useSortState(sortOverride);
    const setSort = useCallback(
        (field: string, order: string = 'ASC') => {
            setSortObject({ field, order });
            setPage(1);
        },
        [setPage, setSortObject]
    );

    const { filter: filterValues, setFilter } = useFilterState({
        permanentFilter: filter,
        filterToQuery,
    });
    const {
        selectedIds,
        onSelect,
        onToggleItem,
        onUnselectItems,
    } = useSelectionState();

    const {
        matchingReferences,
        loading: possibleValuesLoading,
        error: possibleValuesError,
    } = useGetMatchingReferences({
        reference,
        referenceSource,
        filter: filterValues,
        pagination,
        sort,
        resource,
        source,
        id: input.value,
    });

    const {
        referenceRecord,
        error: referenceError,
        loading: referenceLoading,
        loaded: referenceLoaded,
    } = useReference({
        id: input.value,
        reference,
    });

    const dataStatus = getDataStatus({
        input,
        matchingReferences,
        referenceRecord,
        translate,
    });

    return {
        // should match the ListContext shape
        possibleValues: {
            basePath,
            data: matchingReferences.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {}),
            ids: matchingReferences.map(item => item.id),
            // total: ??, <= now that's a problem
            error: possibleValuesError,
            // loaded: ??,
            loading: possibleValuesLoading,
            page,
            setPage,
            perPage,
            setPerPage,
            currentSort: sort,
            setSort,
            filterValues,
            setFilters: setFilter,
            selectedIds,
            onSelect,
            onToggleItem,
            onUnselectItems,
            resource,
        },
        referenceRecord: {
            data: referenceRecord,
            loaded: referenceLoaded,
            loading: referenceLoading,
            error: referenceError,
        },
        dataStatus: {
            error: dataStatus.error,
            loading: dataStatus.waiting,
            warning: dataStatus.warning,
        },
        choices: dataStatus.choices,
        // kept for backwards compatibility
        // @deprecated to be removed in 4.0
        error: dataStatus.error,
        loading: dataStatus.waiting,
        filter: filterValues,
        setFilter,
        pagination,
        setPagination,
        sort,
        setSort: setSortObject,
        warning: dataStatus.warning,
    };
};

export interface ReferenceInputValue {
    possibleValues: ListControllerProps;
    referenceRecord: {
        data?: Record;
        loaded: boolean;
        loading: boolean;
        error?: any;
    };
    dataStatus: {
        error?: any;
        loading: boolean;
        warning?: string;
    };
    choices: Record[];
    error?: string;
    loading: boolean;
    pagination: PaginationPayload;
    setFilter: (filter: string) => void;
    filter: any;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
    sort: SortPayload;
    warning?: string;
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
    referenceSource?: typeof defaultReferenceSource;
    resource: string;
    sort?: SortPayload;
    source: string;
}

export default useReferenceInputController;
