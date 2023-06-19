import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import { useSafeSetState, removeEmpty } from '../../util';
import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../notification';
import { Identifier, RaRecord, SortPayload } from '../../types';
import { ListControllerResult } from '../list';
import usePaginationState from '../usePaginationState';
import { useRecordSelection } from '../list/useRecordSelection';
import useSortState from '../useSortState';
import { useResourceContext } from '../../core';

export interface UseReferenceManyFieldControllerParams<
    RecordType extends RaRecord = RaRecord
> {
    filter?: any;
    page?: number;
    perPage?: number;
    record?: RecordType;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source?: string;
    target: string;
}

const defaultFilter = {};

/**
 * Fetch reference records, and return them when available
 *
 * Uses dataProvider.getManyReference() internally.
 *
 * @example // fetch the comments related to the current post
 * const { isLoading, data } = useReferenceManyFieldController({
 *     reference: 'comments',
 *     target: 'post_id',
 *     record: { id: 123, title: 'hello, world' },
 *     resource: 'posts',
 * });
 *
 * @param {Object} props
 * @param {string} props.reference The linked resource name. Required.
 * @param {string} props.target The target resource key. Required.
 * @param {Object} props.filter The filter applied on the recorded records list
 * @param {number} props.page the page number
 * @param {number} props.perPage the number of item per page
 * @param {Object} props.record The current resource record
 * @param {string} props.resource The current resource name
 * @param {Object} props.sort the sort to apply to the referenced records
 * @param {string} props.source The key of the linked resource identifier
 *
 * @returns {ListControllerResult} The reference many props
 */
export const useReferenceManyFieldController = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord
>(
    props: UseReferenceManyFieldControllerParams<RecordType>
): ListControllerResult<ReferenceRecordType> => {
    const {
        reference,
        record,
        target,
        filter = defaultFilter,
        source,
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort = { field: 'id', order: 'DESC' },
    } = props;
    const notify = useNotify();
    const resource = useResourceContext(props);

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
    const [selectedIds, selectionModifiers] = useRecordSelection(
        `${resource}.${record?.id}.${reference}`
    );

    // filter logic
    const filterRef = useRef(filter);
    const [displayedFilters, setDisplayedFilters] = useSafeSetState<{
        [key: string]: boolean;
    }>({});
    const [filterValues, setFilterValues] = useSafeSetState<{
        [key: string]: any;
    }>(filter);
    const hideFilter = useCallback(
        (filterName: string) => {
            setDisplayedFilters(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
            setFilterValues(previousState => {
                const { [filterName]: _, ...newState } = previousState;
                return newState;
            });
        },
        [setDisplayedFilters, setFilterValues]
    );
    const showFilter = useCallback(
        (filterName: string, defaultValue: any) => {
            setDisplayedFilters(previousState => ({
                ...previousState,
                [filterName]: true,
            }));
            setFilterValues(previousState => ({
                ...previousState,
                [filterName]: defaultValue,
            }));
        },
        [setDisplayedFilters, setFilterValues]
    );
    const setFilters = useCallback(
        (filters, displayedFilters) => {
            setFilterValues(removeEmpty(filters));
            setDisplayedFilters(displayedFilters);
            setPage(1);
        },
        [setDisplayedFilters, setFilterValues, setPage]
    );
    // handle filter prop change
    useEffect(() => {
        if (!isEqual(filter, filterRef.current)) {
            filterRef.current = filter;
            setFilterValues(filter);
        }
    });

    const {
        data,
        total,
        pageInfo,
        error,
        isFetching,
        isLoading,
        refetch,
    } = useGetManyReference<ReferenceRecordType>(
        reference,
        {
            target,
            id: get(record, source) as Identifier,
            pagination: { page, perPage },
            sort,
            filter: filterValues,
        },
        {
            keepPreviousData: true,
            onError: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    {
                        type: 'error',
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
        filterValues,
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
