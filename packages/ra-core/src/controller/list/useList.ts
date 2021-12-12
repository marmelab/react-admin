import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { removeEmpty, useSafeSetState } from '../../util';
import { FilterPayload, Record, SortPayload } from '../../types';
import usePaginationState from '../usePaginationState';
import useSortState from '../useSortState';
import useSelectionState from '../useSelectionState';
import { ListControllerResult } from './useListController';

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
 * @param {Record[]} props.data An array of records
 * @param {Boolean} props.isFetching: Optional. A boolean indicating whether the data is being loaded
 * @param {Boolean} props.isLoading: Optional. A boolean indicating whether the data has been loaded at least once
 * @param {Error | String} props.error: Optional. The error if any occurred while loading the data
 * @param {Object} props.filter: Optional. An object containing the filters applied on the data
 * @param {Number} props.page: Optional. The initial page index
 * @param {Number} props.perPage: Optional. The initial page size
 * @param {SortPayload} props.sort: Optional. The initial sort (field and order)
 */
export const useList = <RecordType extends Record = Record>(
    props: UseListOptions<RecordType>
): UseListValue<RecordType> => {
    const {
        data,
        error,
        filter = defaultFilter,
        isFetching = false,
        isLoading = false,
        page: initialPage = 1,
        perPage: initialPerPage = 1000,
        sort: initialSort = defaultSort,
    } = props;
    const [fetchingState, setFetchingState] = useSafeSetState<boolean>(
        isFetching
    );
    const [loadingState, setLoadingState] = useSafeSetState<boolean>(isLoading);

    const [finalItems, setFinalItems] = useSafeSetState<{
        data: RecordType[];
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
    const { sort, setSort: setSortObject } = useSortState(initialSort);
    const setSort = useCallback(
        (field: string, order = 'ASC') => {
            setSortObject({ field, order });
            setPage(1);
        },
        [setPage, setSortObject]
    );

    // selection logic
    const {
        selectedIds,
        onSelect,
        onToggleItem,
        onUnselectItems,
    } = useSelectionState();

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
        (filters, displayedFilters) => {
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
    useEffect(() => {
        if (isLoading) return;

        // 1. filter
        let tempData = data.filter(record =>
            Object.entries(filterValues).every(([filterName, filterValue]) => {
                const recordValue = get(record, filterName);
                const result = Array.isArray(recordValue)
                    ? Array.isArray(filterValue)
                        ? recordValue.some(item => filterValue.includes(item))
                        : recordValue.includes(filterValue)
                    : Array.isArray(filterValue)
                    ? filterValue.includes(recordValue)
                    : filterValue == recordValue; // eslint-disable-line eqeqeq
                return result;
            })
        );

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
    }, [
        data,
        filterValues,
        isLoading,
        page,
        perPage,
        setFinalItems,
        sort.field,
        sort.order,
    ]);

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
        currentSort: sort,
        data: finalItems.data,
        error,
        displayedFilters,
        filterValues,
        hideFilter,
        isFetching: fetchingState,
        isLoading: loadingState,
        onSelect,
        onToggleItem,
        onUnselectItems,
        page,
        perPage,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        setSort,
        showFilter,
        total: finalItems.total,
    };
};

export interface UseListOptions<RecordType extends Record = Record> {
    data: RecordType[];
    error?: any;
    filter?: FilterPayload;
    isFetching?: boolean;
    isLoading?: boolean;
    page?: number;
    perPage?: number;
    sort?: SortPayload;
}

export type UseListValue<RecordType extends Record = Record> = Omit<
    ListControllerResult<RecordType>,
    'resource' | 'basePath' | 'refetch'
>;

const defaultFilter = {};
const defaultSort = { field: null, order: null };
