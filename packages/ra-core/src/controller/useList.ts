import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { indexById, removeEmpty, useSafeSetState } from '../util';
import { Identifier, Record, RecordMap, SortPayload } from '../types';
import usePaginationState from './usePaginationState';
import useSortState from './useSortState';
import useSelectionState from './useSelectionState';
import { ListControllerProps } from '.';

/**
 * Hook that applies list filtering, sorting and pagination on the provided data, either in memory or through the provided function.
 *
 * @example
 * const data = [
 *     { id: 1, name: 'Arnold' },
 *     { id: 2, name: 'Sylvester' },
 *     { id: 3, name: 'Jean-Claude' },
 * ]
 * const { ids, data, error, loaded, loading } = useList({
 *      ids: providedIds,
 *      data: providedData,
 *      basePath: '/resource';
 *      resource: 'resource';
 * });
 *
 * @param {Object} props
 * @param {string} props.basePath basepath to current resource
 * @param {string} props.resource The current resource name
 */
export const useList = (props: UseListOptions): UseListValue => {
    const {
        data,
        error,
        filter = defaultFilter,
        ids,
        initialData,
        initialIds,
        loaded,
        loading,
        initialPage = 1,
        initialPerPage = 1000,
        initialSort = defaultSort,
        total,
    } = props;
    const [loadingState, setLoadingState] = useSafeSetState<boolean>(loading);
    const [loadedState, setLoadedState] = useSafeSetState<boolean>(loaded);

    const [finalItems, setFinalItems] = useSafeSetState<{
        data: RecordMap;
        ids: Identifier[];
    }>(() => ({
        data: indexById(initialData),
        ids: initialIds,
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

    // We do all the data processing (filtering, sorting, paginating) client-side
    useEffect(() => {
        if (!loaded) return;
        // 1. filter
        let tempData = initialData.filter(record =>
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
        initialData,
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
        currentSort: props.currentSort || sort,
        data: data || finalItems.data,
        error,
        displayedFilters: props.displayedFilters || displayedFilters,
        filterValues: props.filterValues || filterValues,
        hideFilter: props.hideFilter || hideFilter,
        ids: ids || finalItems.ids,
        loaded: loadedState,
        loading: loadingState,
        onSelect: props.onSelect || onSelect,
        onToggleItem: props.onToggleItem || onToggleItem,
        onUnselectItems: props.onUnselectItems || onUnselectItems,
        page: props.page || page,
        perPage: props.perPage || perPage,
        selectedIds: props.selectedIds || selectedIds,
        setFilters: props.setFilters || setFilters,
        setPage: props.setPage || setPage,
        setPerPage: props.setPerPage || setPerPage,
        setSort: props.setSort || setSort,
        showFilter: props.showFilter || showFilter,
        total: total || finalItems.ids.length,
    };
};

export interface UseListOptions
    extends Partial<
        Omit<ListControllerProps, 'resource' | 'basePath' | 'refetch'>
    > {
    error?: any;
    filter?: any;
    initialPage?: number;
    initialPerPage?: number;
    initialSort?: SortPayload;
    initialData: Record[];
    initialIds: Identifier[];
    loaded: boolean;
    loading: boolean;
}

export type UseListValue = Omit<
    ListControllerProps,
    'resource' | 'basePath' | 'refetch'
>;

const defaultFilter = {};
const defaultSort = { field: null, order: null };
