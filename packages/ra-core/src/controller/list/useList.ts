import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { removeEmpty, useSafeSetState } from '../../util';
import { FilterPayload, RaRecord, SortPayload } from '../../types';
import { useResourceContext } from '../../core';
import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';
import { useRecordSelection } from './useRecordSelection';
import { ListControllerResult } from './useListController';
import { flattenObject } from '../../dataProvider/fetch';

const refetch = () => {
    throw new Error(
        'refetch is not available for a ListContext built from useList based on local data'
    );
};

/**
 * Handle filtering, sorting and pagination on local data.
 *
 * Returns the data and callbacks expected by <ListContext>.
 *
 * @example
 * const data = [
 *     { id: 1, name: 'Arnold' },
 *     { id: 2, name: 'Sylvester' },
 *     { id: 3, name: 'Jean-Claude' },
 * ]
 *
 * const MyComponent = () => {
 *     const listContext = useList({ data });
 *     return (
 *         <ListContextProvider value={listContext}>
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="name" />
 *             </Datagrid>
 *         </ListContextProvider>
 *     );
 * };
 *
 * @param {UseListOptions} props
 * @param {RaRecord[]} props.data An array of records
 * @param {Boolean} props.isFetching: Optional. A boolean indicating whether the data is being loaded
 * @param {Boolean} props.isLoading: Optional. A boolean indicating whether the data has been loaded at least once
 * @param {Error | String} props.error: Optional. The error if any occurred while loading the data
 * @param {Object} props.filter: Optional. An object containing the filters applied on the data
 * @param {Number} props.page: Optional. The initial page index
 * @param {Number} props.perPage: Optional. The initial page size
 * @param {SortPayload} props.sort: Optional. The initial sort (field and order)
 * @param {filterCallback} prop.filterCallback Optional. A function that allows you to make a custom filter
 */
export const useList = <RecordType extends RaRecord = any>(
    props: UseListOptions<RecordType>
): UseListValue<RecordType> => {
    const {
        data,
        error,
        filter = defaultFilter,
        isFetching = false,
        isLoading = false,
        isPending = false,
        page: initialPage = 1,
        perPage: initialPerPage = 1000,
        sort: initialSort,
        filterCallback = (record: RecordType) => Boolean(record),
    } = props;
    const resource = useResourceContext(props);

    const [fetchingState, setFetchingState] = useSafeSetState<boolean>(
        isFetching
    ) as [boolean, (isFetching: boolean) => void];

    const [loadingState, setLoadingState] = useSafeSetState<boolean>(
        isLoading
    ) as [boolean, (isLoading: boolean) => void];

    const [pendingState, setPendingState] = useSafeSetState<boolean>(
        isPending
    ) as [boolean, (isPending: boolean) => void];

    const [finalItems, setFinalItems] = useSafeSetState<{
        data?: RecordType[];
        total?: number;
    }>(() => ({
        data,
        total: data ? data.length : undefined,
    }));

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
        resource
            ? {
                  resource,
              }
            : { disableSyncWithStore: true }
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
            setFilterValues(previousState =>
                removeEmpty({
                    ...previousState,
                    [filterName]: defaultValue,
                })
            );
        },
        [setDisplayedFilters, setFilterValues]
    );
    const setFilters = useCallback(
        (filters, displayedFilters = undefined) => {
            setFilterValues(removeEmpty(filters));
            if (displayedFilters) {
                setDisplayedFilters(displayedFilters);
            }
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

    // We do all the data processing (filtering, sorting, paginating) client-side
    useEffect(
        () => {
            if (isPending || !data) return;
            let tempData = data;

            // 1. filter
            if (filterValues) {
                const flattenFilterValues = flattenObject(filterValues);
                tempData = data
                    .filter(record =>
                        Object.entries(flattenFilterValues).every(
                            ([filterName, filterValue]) => {
                                const recordValue = get(record, filterName);
                                const result = Array.isArray(recordValue)
                                    ? Array.isArray(filterValue)
                                        ? recordValue.some(item =>
                                              filterValue.includes(item)
                                          )
                                        : recordValue.includes(filterValue)
                                    : Array.isArray(filterValue)
                                      ? filterValue.includes(recordValue)
                                      : filterName === 'q' // special full-text filter
                                        ? Object.keys(record).some(
                                              key =>
                                                  typeof record[key] ===
                                                      'string' &&
                                                  record[key]
                                                      .toLowerCase()
                                                      .includes(
                                                          (
                                                              filterValue as string
                                                          ).toLowerCase()
                                                      )
                                          )
                                        : filterValue == recordValue; // eslint-disable-line eqeqeq
                                return result;
                            }
                        )
                    )
                    .filter(filterCallback);
            }
            const filteredLength = tempData.length;

            // 2. sort
            if (sort.field) {
                tempData = tempData.sort((a, b) => {
                    if (get(a, sort.field) > get(b, sort.field)) {
                        return sort.order === 'ASC' ? 1 : -1;
                    }
                    if (get(a, sort.field) < get(b, sort.field)) {
                        return sort.order === 'ASC' ? -1 : 1;
                    }
                    return 0;
                });
            }

            // 3. paginate
            tempData = tempData.slice((page - 1) * perPage, page * perPage);

            setFinalItems({
                data: tempData,
                total: filteredLength,
            });
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            // eslint-disable-next-line react-hooks/exhaustive-deps
            JSON.stringify(data),
            filterValues,
            isPending,
            page,
            perPage,
            setFinalItems,
            sort.field,
            sort.order,
        ]
    );

    useEffect(() => {
        if (isFetching !== fetchingState) {
            setFetchingState(isFetching);
        }
    }, [isFetching, fetchingState, setFetchingState]);

    useEffect(() => {
        if (isLoading !== loadingState) {
            setLoadingState(isLoading);
        }
    }, [isLoading, loadingState, setLoadingState]);

    useEffect(() => {
        if (isPending !== pendingState) {
            setPendingState(isPending);
        }
    }, [isPending, pendingState, setPendingState]);

    return {
        sort,
        data: pendingState ? undefined : finalItems?.data ?? [],
        defaultTitle: '',
        error: error ?? null,
        displayedFilters,
        filterValues,
        hasNextPage:
            finalItems?.total == null
                ? false
                : page * perPage < finalItems.total,
        hasPreviousPage: page > 1,
        hideFilter,
        isFetching: fetchingState,
        isLoading: loadingState,
        isPending: pendingState,
        onSelect: selectionModifiers.select,
        onToggleItem: selectionModifiers.toggle,
        onUnselectItems: selectionModifiers.clearSelection,
        page,
        perPage,
        resource: '',
        refetch,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        setSort,
        showFilter,
        total: finalItems?.total,
    } as UseListValue<RecordType>;
};

export interface UseListOptions<RecordType extends RaRecord = any> {
    data?: RecordType[];
    error?: any;
    filter?: FilterPayload;
    isFetching?: boolean;
    isLoading?: boolean;
    isPending?: boolean;
    page?: number;
    perPage?: number;
    sort?: SortPayload;
    resource?: string;
    filterCallback?: (record: RecordType) => boolean;
}

export type UseListValue<RecordType extends RaRecord = any> =
    ListControllerResult<RecordType>;

const defaultFilter = {};
