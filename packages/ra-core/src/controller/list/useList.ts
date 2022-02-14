import { useCallback, useEffect } from 'react';
import get from 'lodash/get';
import { removeEmpty, useSafeSetState } from '../../util';
import { RaRecord, SortPayload, FilterItem } from '../../types';
import { useResourceContext } from '../../core';
import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';
import { useRecordSelection } from './useRecordSelection';
import { ListControllerResult } from './useListController';

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
 */
export const useList = <RecordType extends RaRecord = any>(
    props: UseListOptions<RecordType>
): UseListValue<RecordType> => {
    const {
        data,
        error,
        filter = defaultFilters,
        filterDefaultValues = defaultFilters,
        isFetching = false,
        isLoading = false,
        page: initialPage = 1,
        perPage: initialPerPage = 1000,
        sort: initialSort = defaultSort,
    } = props;
    const resource = useResourceContext(props);

    const [fetchingState, setFetchingState] = useSafeSetState<boolean>(
        isFetching
    );
    const [loadingState, setLoadingState] = useSafeSetState<boolean>(isLoading);

    const [finalItems, setFinalItems] = useSafeSetState<{
        data?: RecordType[];
        total: number;
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
    const [selectedIds, selectionModifiers] = useRecordSelection(resource);

    // filter logic
    const [filterValues, setFilterValues] = useSafeSetState<FilterItem[]>(
        filterDefaultValues
    );
    const [displayedFilters, setDisplayedFilters] = useSafeSetState<{
        [key: string]: boolean;
    }>({});

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
            if (displayedFilters) {
                setDisplayedFilters(displayedFilters);
            }
            setPage(1);
        },
        [setDisplayedFilters, setFilterValues, setPage]
    );

    // We do all the data processing (filtering, sorting, paginating) client-side
    useEffect(
        () => {
            if (isLoading || !data) return;

            // 1. filter
            const allFilters = [].concat(filterValues, filter);
            let tempData =
                allFilters.length > 0
                    ? data.filter(record =>
                          allFilters.every(({ field, operator, value }) => {
                              // FIXME: only supports operator = for now
                              const recordValue = get(record, field);
                              return Array.isArray(recordValue)
                                  ? Array.isArray(value)
                                      ? recordValue.some(item =>
                                            value.includes(item)
                                        )
                                      : recordValue.includes(value)
                                  : Array.isArray(value)
                                  ? value.includes(recordValue)
                                  : value == recordValue; // eslint-disable-line eqeqeq
                          })
                      )
                    : data;

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
            filter,
            filterValues,
            isLoading,
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

    return {
        data: finalItems.data,
        defaultTitle: '',
        displayedFilters,
        error,
        filters: filterValues,
        hasNextPage: page * perPage < finalItems.total,
        hasPreviousPage: page > 1,
        hideFilter,
        isFetching: fetchingState,
        isLoading: loadingState,
        onSelect: selectionModifiers.select,
        onToggleItem: selectionModifiers.toggle,
        onUnselectItems: selectionModifiers.clearSelection,
        page,
        perPage,
        resource: undefined,
        refetch,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        setSort,
        showFilter,
        sort,
        total: finalItems.total,
    };
};

export interface UseListOptions<RecordType extends RaRecord = any> {
    data?: RecordType[];
    error?: any;
    filter?: FilterItem[];
    filterDefaultValues?: FilterItem[];
    isFetching?: boolean;
    isLoading?: boolean;
    page?: number;
    perPage?: number;
    sort?: SortPayload;
    resource?: string;
}

export type UseListValue<
    RecordType extends RaRecord = any
> = ListControllerResult<RecordType>;

const defaultFilters = [];
const defaultSort = { field: null, order: null };
