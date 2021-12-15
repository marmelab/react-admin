import { isValidElement, useEffect, useMemo } from 'react';
import { UseQueryOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import { useTranslate } from '../../i18n';
import { useNotify } from '../../sideEffect';
import { useGetList, Refetch } from '../../dataProvider';
import { SORT_ASC } from '../../reducer/admin/resource/list/queryReducer';
import { defaultExporter } from '../../export';
import {
    FilterPayload,
    SortPayload,
    Identifier,
    Record,
    Exporter,
} from '../../types';
import { useResourceContext, useGetResourceLabel } from '../../core';
import useRecordSelection from '../useRecordSelection';
import { useListParams } from './useListParams';

/**
 * Prepare data for the List view
 *
 * @param {Object} props The props passed to the List component.
 *
 * @return {Object} controllerProps Fetched and computed data for the List view
 *
 * @example
 *
 * import { useListController } from 'react-admin';
 * import ListView from './ListView';
 *
 * const MyList = props => {
 *     const controllerProps = useListController(props);
 *     return <ListView {...controllerProps} {...props} />;
 * }
 */
export const useListController = <RecordType extends Record = Record>(
    props: ListControllerProps<RecordType> = {}
): ListControllerResult<RecordType> => {
    const {
        disableAuthentication,
        exporter = defaultExporter,
        filterDefaultValues,
        sort = defaultSort,
        perPage = 10,
        filter,
        debounce = 500,
        disableSyncWithLocation,
        queryOptions,
    } = props;
    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);

    if (!resource) {
        throw new Error(
            `<List> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }
    if (filter && isValidElement(filter)) {
        throw new Error(
            '<List> received a React element as `filter` props. If you intended to set the list filter elements, use the `filters` (with an s) prop instead. The `filter` prop is internal and should not be set by the developer.'
        );
    }

    const translate = useTranslate();
    const notify = useNotify();

    const [query, queryModifiers] = useListParams({
        resource,
        filterDefaultValues,
        sort,
        perPage,
        debounce,
        disableSyncWithLocation,
    });

    const [selectedIds, selectionModifiers] = useRecordSelection(resource);

    /**
     * We want the list of ids to be always available for optimistic rendering,
     * and therefore we need a custom action (CRUD_GET_LIST) that will be used.
     */
    const { data, total, error, isLoading, isFetching, refetch } = useGetList<
        RecordType
    >(
        resource,
        {
            pagination: {
                page: query.page,
                perPage: query.perPage,
            },
            sort: { field: query.sort, order: query.order },
            filter: { ...query.filter, ...filter },
        },
        {
            keepPreviousData: true,
            retry: false,
            onError: error =>
                notify(
                    error?.message || 'ra.notification.http_error',
                    'warning',
                    {
                        _: error?.message,
                    }
                ),
            ...queryOptions,
        }
    );

    // change page if there is no data
    useEffect(() => {
        const totalPages = Math.ceil(total / query.perPage) || 1;
        if (
            query.page <= 0 ||
            (!isFetching && query.page > 1 && data.length === 0)
        ) {
            // Query for a page that doesn't exist, set page to 1
            queryModifiers.setPage(1);
        } else if (!isFetching && query.page > totalPages) {
            // Query for a page out of bounds, set page to the last existing page
            // It occurs when deleting the last element of the last page
            queryModifiers.setPage(totalPages);
        }
    }, [isFetching, query.page, query.perPage, data, queryModifiers, total]);

    const currentSort = useMemo(
        () => ({
            field: query.sort,
            order: query.order,
        }),
        [query.sort, query.order]
    );

    const getResourceLabel = useGetResourceLabel();
    const defaultTitle = translate('ra.page.list', {
        name: getResourceLabel(resource, 2),
    });

    return {
        currentSort,
        data,
        defaultTitle,
        displayedFilters: query.displayedFilters,
        error,
        exporter,
        filter,
        filterValues: query.filterValues,
        hideFilter: queryModifiers.hideFilter,
        isFetching,
        isLoading,
        onSelect: selectionModifiers.select,
        onToggleItem: selectionModifiers.toggle,
        onUnselectItems: selectionModifiers.clearSelection,
        page: query.page,
        perPage: query.perPage,
        refetch,
        resource,
        selectedIds,
        setFilters: queryModifiers.setFilters,
        setPage: queryModifiers.setPage,
        setPerPage: queryModifiers.setPerPage,
        setSort: queryModifiers.setSort,
        showFilter: queryModifiers.showFilter,
        total: total,
    };
};

export interface ListControllerProps<RecordType extends Record = Record> {
    debounce?: number;
    disableAuthentication?: boolean;
    /**
     * Whether to disable the synchronization of the list parameters with the current location (URL search parameters)
     */
    disableSyncWithLocation?: boolean;
    exporter?: Exporter | false;
    filter?: FilterPayload;
    filterDefaultValues?: object;
    perPage?: number;
    queryOptions?: UseQueryOptions<{ data: RecordType[]; total: number }>;
    resource?: string;
    sort?: SortPayload;
}

const defaultSort = {
    field: 'id',
    order: SORT_ASC,
};

export interface ListControllerResult<RecordType extends Record = Record> {
    currentSort: SortPayload;
    data: RecordType[];
    defaultTitle?: string;
    displayedFilters: any;
    error?: any;
    exporter?: Exporter | false;
    filter?: FilterPayload;
    filterValues: any;
    hideFilter: (filterName: string) => void;
    isFetching: boolean;
    isLoading: boolean;
    onSelect: (ids: Identifier[]) => void;
    onToggleItem: (id: Identifier) => void;
    onUnselectItems: () => void;
    page: number;
    perPage: number;
    refetch: Refetch;
    resource: string;
    selectedIds: Identifier[];
    setFilters: (
        filters: any,
        displayedFilters: any,
        debounce?: boolean
    ) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: string, order?: string) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    total: number;
}

export const injectedProps = [
    'basePath',
    'currentSort',
    'data',
    'defaultTitle',
    'displayedFilters',
    'error',
    'exporter',
    'filterValues',
    'hideFilter',
    'isFetching',
    'isLoading',
    'onSelect',
    'onToggleItem',
    'onUnselectItems',
    'page',
    'perPage',
    'refetch',
    'refresh',
    'resource',
    'selectedIds',
    'setFilters',
    'setPage',
    'setPerPage',
    'setSort',
    'showFilter',
    'total',
    'totalPages',
    'version',
];

/**
 * Select the props injected by the useListController hook
 * to be passed to the List children need
 * This is an implementation of pick()
 */
export const getListControllerProps = props =>
    injectedProps.reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

/**
 * Select the props not injected by the useListController hook
 * to be used inside the List children to sanitize props injected by List
 * This is an implementation of omit()
 */
export const sanitizeListRestProps = props =>
    Object.keys(props)
        .filter(propName => !injectedProps.includes(propName))
        .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});
