import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { indexById, removeEmpty, useSafeSetState } from '../util';
import {
    FilterPayload,
    Identifier,
    Record,
    RecordMap,
    SortPayload,
} from '../types';
import usePaginationState from './usePaginationState';
import useSortState from './useSortState';
import useSelectionState from './useSelectionState';
import { ListControllerProps } from '.';

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
 * const ids = [1, 2, 3];
 *
 * const MyComponent = () => {
 *     const listContext = useList({
 *         initialData: data,
 *         initialIds: ids,
 *         basePath: '/resource';
 *         resource: 'resource';
 *     });
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
 * @param {Identifier[]} props.ids An array of the record identifiers
 * @param {Boolean} props.loaded: A boolean indicating whether the data has been loaded at least once
 * @param {Boolean} props.loading: A boolean indicating whether the data is being loaded
 * @param {Error | String} props.error: Optional. The error if any occurred while loading the data
 * @param {Object} props.filter: Optional. An object containing the filters applied on the data
 * @param {Number} props.page: Optional. The initial page index
 * @param {Number} props.perPage: Optional. The initial page size
 * @param {SortPayload} props.sort: Optional. The initial sort (field and order)
 */
export const useList = (props: UseListOptions): UseListValue => {
    const {
        data,
        error,
        filter = defaultFilter,
        ids,
        loaded,
        loading,
        page: initialPage = 1,
        perPage: initialPerPage = 1000,
        sort: initialSort = defaultSort,
    } = props;
    const [loadingState, setLoadingState] = useSafeSetState<boolean>(loading);
    const [loadedState, setLoadedState] = useSafeSetState<boolean>(loaded);

    const [finalItems, setFinalItems] = useSafeSetState<{
        data: RecordMap;
        ids: Identifier[];
    }>(() => ({
        data: indexById(data),
        ids,
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
        if (!loaded) return;

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
        const finalData = indexById(tempData);
        const finalIds = tempData
            .filter(data => typeof data !== 'undefined')
            .map(data => data.id);

        setFinalItems({
            data: finalData,
            ids: finalIds,
        });
    }, [
        data,
        filterValues,
        loaded,
        page,
        perPage,
        setFinalItems,
        sort.field,
        sort.order,
    ]);

    useEffect(() => {
        if (loaded !== loadedState) {
            setLoadedState(loaded);
        }
    }, [loaded, loadedState, setLoadedState]);

    useEffect(() => {
        if (loading !== loadingState) {
            setLoadingState(loading);
        }
    }, [loading, loadingState, setLoadingState]);

    return {
        currentSort: sort,
        data: finalItems.data,
        error,
        displayedFilters,
        filterValues,
        hideFilter,
        ids: finalItems.ids,
        loaded: loadedState,
        loading: loadingState,
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
        total: finalItems.ids.length,
    };
};

export interface UseListOptions<RecordType extends Record = Record> {
    data: RecordType[];
    ids: Identifier[];
    error?: any;
    filter?: FilterPayload;
    loading: boolean;
    loaded: boolean;
    page?: number;
    perPage?: number;
    sort?: SortPayload;
}

export type UseListValue = Omit<
    ListControllerProps,
    'resource' | 'basePath' | 'refetch'
>;

const defaultFilter = {};
const defaultSort = { field: null, order: null };
