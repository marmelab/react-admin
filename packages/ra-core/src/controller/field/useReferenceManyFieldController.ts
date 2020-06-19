import get from 'lodash/get';
import { useCallback } from 'react';

import { useSafeSetState, removeEmpty } from '../../util';
import { useGetManyReference } from '../../dataProvider';
import { useNotify } from '../../sideEffect';
import { Record, Sort, RecordMap, Identifier } from '../../types';
import { ListControllerProps } from '../useListController';

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
    sort?: Sort;
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
    const [page, setPage] = useSafeSetState<number>(initialPage);
    const [perPage, setPerPage] = useSafeSetState<number>(initialPerPage);

    // sort logic
    const [sort, setSortObject] = useSafeSetState<Sort>(initialSort);
    const setSort = useCallback(
        (field: string, order: string = 'ASC') => {
            setSortObject(previousState => ({
                field,
                order:
                    field === previousState.field
                        ? previousState.order === 'ASC'
                            ? 'DESC'
                            : 'ASC'
                        : order,
            }));
            setPage(1);
        },
        [setPage, setSortObject]
    );

    // selection logic
    const [selectedIds, setSelectedIds] = useSafeSetState<Identifier[]>([]);
    const onSelect = useCallback(
        (newIds: Identifier[]) => {
            setSelectedIds(newIds);
        },
        [setSelectedIds]
    );
    const onToggleItem = useCallback(
        (id: Identifier) => {
            setSelectedIds(previousState => {
                const index = previousState.indexOf(id);
                if (index > -1) {
                    return [
                        ...previousState.slice(0, index),
                        ...previousState.slice(index + 1),
                    ];
                } else {
                    return [...previousState, id];
                }
            });
        },
        [setSelectedIds]
    );
    const onUnselectItems = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    // filter logic
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
                previousState,
                [filterName]: true,
            }));
            setFilterValues(previousState => ({
                previousState,
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

    const referenceId = get(record, source);
    const { data, ids, total, loading, loaded } = useGetManyReference(
        reference,
        target,
        referenceId,
        { page, perPage },
        sort,
        filter,
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
        resource,
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
