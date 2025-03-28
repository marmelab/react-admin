import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import lodashDebounce from 'lodash/debounce';

import { removeEmpty, useEvent } from '../../util';
import { useDataProvider, useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../notification';
import { FilterPayload, Identifier, RaRecord, SortPayload } from '../../types';
import type { ListControllerResult, HandleSelectAllParams } from '../list';
import usePaginationState from '../usePaginationState';
import { useRecordSelection } from '../list/useRecordSelection';
import useSortState from '../useSortState';
import { useResourceContext } from '../../core';

/**
 * Fetch reference records, and return them when available
 *
 * Uses dataProvider.getManyReference() internally.
 *
 * @example // fetch the comments related to the current post
 * const { isPending, data } = useReferenceManyFieldController({
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
 * @param {UseQuery Options} props.queryOptions `react-query` options`
 *
 * @returns {ListControllerResult} The reference many props
 */
export const useReferenceManyFieldController = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
    ErrorType = Error,
>(
    props: UseReferenceManyFieldControllerParams<
        RecordType,
        ReferenceRecordType,
        ErrorType
    >
): ListControllerResult<ReferenceRecordType, ErrorType> => {
    const {
        debounce = 500,
        reference,
        record,
        target,
        filter = defaultFilter,
        source = 'id',
        page: initialPage,
        perPage: initialPerPage,
        sort: initialSort = { field: 'id', order: 'DESC' },
        queryOptions = {} as UseQueryOptions<
            { data: ReferenceRecordType[]; total: number },
            ErrorType
        >,
    } = props;
    const notify = useNotify();
    const resource = useResourceContext(props);
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const storeKey = props.storeKey ?? `${resource}.${record?.id}.${reference}`;
    const { meta, ...otherQueryOptions } = queryOptions;

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
    const [selectedIds, selectionModifiers] = useRecordSelection({
        resource: storeKey,
    });

    // filter logic
    const filterRef = useRef(filter);
    const [displayedFilters, setDisplayedFilters] = useState<{
        [key: string]: boolean;
    }>({});
    const [filterValues, setFilterValues] = useState<{
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetFilters = useCallback(
        lodashDebounce((filters, displayedFilters) => {
            setFilterValues(removeEmpty(filters));
            setDisplayedFilters(displayedFilters);
            setPage(1);
        }, debounce),
        [setDisplayedFilters, setFilterValues, setPage]
    );

    const setFilters = useCallback(
        (filters, displayedFilters, debounce = false) => {
            if (debounce) {
                debouncedSetFilters(filters, displayedFilters);
            } else {
                setFilterValues(removeEmpty(filters));
                setDisplayedFilters(displayedFilters);
                setPage(1);
            }
        },
        [setDisplayedFilters, setFilterValues, setPage, debouncedSetFilters]
    );
    // handle filter prop change
    useEffect(() => {
        if (!isEqual(filter, filterRef.current)) {
            filterRef.current = filter;
            setFilterValues(filter);
        }
    }, [filter]);

    const {
        data,
        total,
        meta: responseMeta,
        pageInfo,
        error,
        isFetching,
        isLoading,
        isPending,
        refetch,
    } = useGetManyReference<ReferenceRecordType, ErrorType>(
        reference,
        {
            target,
            id: get(record, source) as Identifier,
            pagination: { page, perPage },
            sort,
            filter: filterValues,
            meta,
        },
        {
            enabled: get(record, source) != null,
            placeholderData: previousData => previousData,
            onError: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : (error as Error)?.message ||
                              'ra.notification.http_error',
                    {
                        type: 'error',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : (error as Error)?.message
                                      ? (error as Error).message
                                      : undefined,
                        },
                    }
                ),
            ...otherQueryOptions,
        }
    );

    const onSelectAll = useEvent(
        async ({
            limit = 250,
            queryOptions = {},
        }: HandleSelectAllParams = {}) => {
            const { meta, onSuccess, onError } = queryOptions;
            try {
                const results = await queryClient.fetchQuery({
                    queryKey: [
                        resource,
                        'getManyReference',
                        {
                            target,
                            id: get(record, source) as Identifier,
                            pagination: { page: 1, perPage: limit },
                            sort,
                            filter,
                            meta,
                        },
                    ],
                    queryFn: () =>
                        dataProvider.getManyReference(reference, {
                            target,
                            id: get(record, source) as Identifier,
                            pagination: { page: 1, perPage: limit },
                            sort,
                            filter,
                            meta,
                        }),
                });

                const allIds = results.data?.map(({ id }) => id) || [];
                selectionModifiers.select(allIds);
                if (allIds.length === limit) {
                    notify('ra.message.select_all_limit_reached', {
                        messageArgs: { max: limit },
                        type: 'warning',
                    });
                }

                if (onSuccess) {
                    onSuccess(results);
                }

                return results.data;
            } catch (error) {
                if (onError) {
                    onError(error);
                }
                notify('ra.notification.http_error', { type: 'warning' });
            }
        }
    );

    return {
        sort,
        data,
        meta: responseMeta,
        defaultTitle: undefined,
        displayedFilters,
        error,
        filterValues,
        hideFilter,
        isFetching,
        isLoading,
        isPending,
        onSelect: selectionModifiers.select,
        onSelectAll,
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
    } as ListControllerResult<ReferenceRecordType, ErrorType>;
};

export interface UseReferenceManyFieldControllerParams<
    RecordType extends Record<string, any> = Record<string, any>,
    ReferenceRecordType extends Record<string, any> = Record<string, any>,
    ErrorType = Error,
> {
    debounce?: number;
    filter?: FilterPayload;
    page?: number;
    perPage?: number;
    record?: RecordType;
    reference: string;
    resource?: string;
    sort?: SortPayload;
    source?: string;
    storeKey?: string;
    target: string;
    queryOptions?: Omit<
        UseQueryOptions<
            { data: ReferenceRecordType[]; total: number },
            ErrorType
        >,
        'queryKey' | 'queryFn'
    >;
}

const defaultFilter = {};
