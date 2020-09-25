import get from 'lodash/get';
import { useCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

import { useSafeSetState, removeEmpty } from '../../util';
import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../sideEffect';
import { Record, SortPayload, RecordMap } from '../../types';
import { ListControllerProps } from '../useListController';
import usePaginationState from '../usePaginationState';
import useSelectionState from '../useSelectionState';
import useSortState from '../useSortState';

interface Options {
    basePath: string;
    data?: RecordMap;
    filter?: any;
    ids?: any[];
    loaded?: boolean;
    page?: number;
    perPage?: number;
    record?: Record;
    reference: string;
    resource: string;
    sort?: SortPayload;
    source?: string;
    target: string;
    total?: number;
}

const defaultFilter = {};

/**
 * Fetch reference records, and return them when avaliable
 *
 * The reference prop sould be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example
 *
 * const { loaded, referenceRecord, resourceLinkPath } = useReferenceManyFieldController({
 *     resource
 *     reference: 'users',
 *     record: {
 *         userId: 7
 *     }
 *     target: 'comments',
 *     source: 'userId',
 *     basePath: '/comments',
 *     page: 1,
 *     perPage: 25,
 * });
 *
 * @param {Object} option
 * @param {string} option.resource The current resource name
 * @param {string} option.reference The linked resource name
 * @param {Object} option.record The current resource record
 * @param {string} option.target The target resource key
 * @param {Object} option.filter The filter applied on the recorded records list
 * @param {string} option.source The key of the linked resource identifier
 * @param {string} option.basePath basepath to current resource
 * @param {number} option.page the page number
 * @param {number} option.perPage the number of item per page
 * @param {Object} option.sort the sort to apply to the referenced records
 *
 * @returns {ReferenceManyProps} The reference many props
 */
const useReferenceManyFieldController = ({
    resource,
    reference,
    record,
    target,
    filter = defaultFilter,
    source,
    basePath,
    page: initialPage,
    perPage: initialPerPage,
    sort: initialSort = { field: 'id', order: 'DESC' },
}: Options): ListControllerProps => {
    const notify = useNotify();

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

    const referenceId = get(record, source);
    const { data, ids, total, error, loading, loaded } = useGetManyReference(
        reference,
        target,
        referenceId,
        { page, perPage },
        sort,
        filterValues,
        resource,
        {
            onFailure: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning'
                ),
        }
    );

    return {
        basePath: basePath.replace(resource, reference),
        currentSort: sort,
        data,
        defaultTitle: null,
        displayedFilters,
        error,
        filterValues,
        hasCreate: false,
        hideFilter,
        ids,
        loaded,
        loading,
        onSelect,
        onToggleItem,
        onUnselectItems,
        page,
        perPage,
        resource: reference,
        selectedIds,
        setFilters,
        setPage,
        setPerPage,
        setSort,
        showFilter,
        total,
    };
};

export default useReferenceManyFieldController;
