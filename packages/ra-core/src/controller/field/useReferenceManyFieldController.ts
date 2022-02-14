import get from 'lodash/get';
import { useCallback } from 'react';

import { useSafeSetState, removeEmpty } from '../../util';
import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../notification';
import { RaRecord, SortPayload, FilterItem, FilterPayload } from '../../types';
import { ListControllerResult } from '../list';
import usePaginationState from '../usePaginationState';
import { useRecordSelection } from '../list/useRecordSelection';
import useSortState from '../useSortState';
import { convertFiltersToFilterItems } from '../list/convertFiltersToFilterItems';

export interface UseReferenceManyFieldControllerParams {
    filterDefaultValues?: FilterItem[];
    filter?: FilterItem[] | FilterPayload;
    page?: number;
    perPage?: number;
    record?: RaRecord;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source?: string;
    target: string;
}

const defaultFilter = [];

/**
 * Fetch reference records, and return them when available
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { isLoading, data } = useReferenceManyFieldController({
 *     resource
 *     reference: 'users',
 *     record: {
 *         userId: 7
 *     }
 *     target: 'comments',
 *     source: 'userId',
 *     page: 1,
 *     perPage: 25,
 * });
 *
 * @param {Object} props
 * @param {string} props.resource The current resource name
 * @param {string} props.reference The linked resource name
 * @param {Object} props.record The current resource record
 * @param {string} props.target The target resource key
 * @param {Object} props.filter The filter applied on the recorded records list
 * @param {string} props.source The key of the linked resource identifier
 * @param {number} props.page the page number
 * @param {number} props.perPage the number of item per page
 * @param {Object} props.sort the sort to apply to the referenced records
 *
 * @returns {ListControllerResult} The reference many props
 */
export const useReferenceManyFieldController = (
    props: UseReferenceManyFieldControllerParams
): ListControllerResult => {
    const {
        reference,
        record,
        target,
        filter,
        filterDefaultValues,
        source,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort = { field: 'id', order: 'DESC' },
    } = props;
    const notify = useNotify();

    // pagination logic
    const { page, setPage, perPage, setPerPage } = usePaginationState({
        page: initialPage,
        perPage: initialPerPage,
    });

    // sort logic
    const { sort, setSort: setSortState } = useSortState(initialSort);
    const setSort = useCallback(
        (sort: SortPayload) => {
            setSortState(sort);
            setPage(1);
        },
        [setPage, setSortState]
    );

    // selection logic
    const [selectedIds, selectionModifiers] = useRecordSelection(reference);

    // filter logic
    const [displayedFilters, setDisplayedFilters] = useSafeSetState<{
        [key: string]: boolean;
    }>({});
    const [filterValues, setFilterValues] = useSafeSetState<FilterItem[]>(
        filterDefaultValues || defaultFilter
    );
    const hideFilter = useCallback(
        (filterName: string) => {
            setDisplayedFilters(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
            setFilterValues(previousState =>
                previousState.filter(filter => filter.field !== filterName)
            );
        },
        [setDisplayedFilters, setFilterValues]
    );
    const showFilter = useCallback(
        (filterName: string, defaultValue: any) => {
            setDisplayedFilters(previousState => ({
                ...previousState,
                [filterName]: true,
            }));
            setFilterValues(previousState =>
                defaultValue
                    ? previousState
                          .filter(filter => filter.field !== filterName)
                          .concat({ field: filterName, value: defaultValue })
                    : previousState
            );
        },
        [setDisplayedFilters, setFilterValues]
    );
    const setFilters = useCallback(
        (
            filters: FilterItem[],
            displayedFilters: { [key: string]: boolean }
        ) => {
            setFilterValues(removeEmpty(filters));
            setDisplayedFilters(displayedFilters);
            setPage(1);
        },
        [setDisplayedFilters, setFilterValues, setPage]
    );

    const {
        data,
        total,
        pageInfo,
        error,
        isFetching,
        isLoading,
        refetch,
    } = useGetManyReference(
        reference,
        {
            target,
            id: get(record, source),
            pagination: { page, perPage },
            sort,
            filters: [...filterValues, ...convertFiltersToFilterItems(filter)],
        },
        {
            onError: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'warning',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                ),
        }
    );

    return {
        sort,
        data,
        defaultTitle: null,
        displayedFilters,
        error,
        filters: filterValues,
        hideFilter,
        isFetching,
        isLoading,
        onSelect: selectionModifiers.select,
        onToggleItem: selectionModifiers.toggle,
        onUnselectItems: selectionModifiers.clearSelection,
        page,
        perPage,
        refetch,
        resource: reference,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        hasNextPage: pageInfo
            ? pageInfo.hasNextPage
            : total != null
            ? page * perPage < total
            : undefined,
        hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : page > 1,
        setSort,
        showFilter,
        total,
    };
};
