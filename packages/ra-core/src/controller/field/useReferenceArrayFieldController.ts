import { useCallback, useEffect, useRef } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import { useSafeSetState, removeEmpty } from '../../util';
import { Record, RecordMap, Identifier, SortPayload } from '../../types';
import { useGetMany } from '../../dataProvider';
import { ListControllerProps } from '../useListController';
import { useNotify } from '../../sideEffect';
import usePaginationState from '../usePaginationState';
import useSelectionState from '../useSelectionState';
import useSortState from '../useSortState';

interface Option {
    basePath: string;
    filter?: any;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source: string;
}

const defaultFilter = {};
const defaultSort = { field: null, order: null };

/**
 * Hook that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * @example
 *
 * const { ids, data, error, loaded, loading, referenceBasePath } = useReferenceArrayFieldController({
 *      basePath: 'resource';
 *      record: { referenceIds: ['id1', 'id2']};
 *      reference: 'reference';
 *      resource: 'resource';
 *      source: 'referenceIds';
 * });
 *
 * @param {Object} option
 * @param {string} option.basePath basepath to current resource
 * @param {Object} option.record The The current resource record
 * @param {string} option.reference The linked resource name
 * @param {string} option.resource The current resource name
 * @param {string} option.source The key of the linked resource identifier
 *
 * @returns {ReferenceArrayProps} The reference props
 */
const useReferenceArrayFieldController = ({
    basePath,
    filter = defaultFilter,
    page: initialPage = 1,
    perPage: initialPerPage = 1000,
    record,
    reference,
    resource,
    sort: initialSort = defaultSort,
    source,
}: Option): ListControllerProps => {
    const notify = useNotify();
    const ids = get(record, source) || [];
    const { data, error, loading, loaded } = useGetMany(reference, ids, {
        onFailure: error =>
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning'
            ),
    });

    const [finalData, setFinalData] = useSafeSetState<RecordMap>(
        indexById(data)
    );
    const [finalIds, setFinalIds] = useSafeSetState<Identifier[]>(ids);

    // pagination logic
    const { page, setPage, perPage, setPerPage } = usePaginationState({
        page: initialPage,
        perPage: initialPerPage,
    });

    // sort logic
    const { sort, setSort: setSortObject } = useSortState(initialSort);
    const setSort = useCallback(
        (field: string, order: string = 'ASC') => {
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
        let tempData = data.filter(record =>
            Object.entries(filterValues).every(
                ([filterName, filterValue]) =>
                    // eslint-disable-next-line eqeqeq
                    filterValue == get(record, filterName)
            )
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
        setFinalData(indexById(tempData));
        setFinalIds(
            tempData
                .filter(data => typeof data !== 'undefined')
                .map(data => data.id)
        );
    }, [
        data,
        filterValues,
        loaded,
        page,
        perPage,
        setFinalData,
        setFinalIds,
        sort.field,
        sort.order,
    ]);

    return {
        basePath: basePath.replace(resource, reference),
        currentSort: sort,
        data: finalData,
        defaultTitle: null,
        error,
        displayedFilters,
        filterValues,
        hasCreate: false,
        hideFilter,
        ids: finalIds,
        loaded,
        loading,
        onSelect,
        onToggleItem,
        onUnselectItems,
        page,
        perPage,
        resource,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        setSort,
        showFilter,
        total: finalIds.length,
    };
};

const indexById = (records: Record[] = []): RecordMap =>
    records
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, current) => {
            prev[current.id] = current;
            return prev;
        }, {});

export default useReferenceArrayFieldController;
