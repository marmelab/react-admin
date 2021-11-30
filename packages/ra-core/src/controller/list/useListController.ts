import { isValidElement, ReactElement, useEffect, useMemo } from 'react';
import { Location } from 'history';

import { useAuthenticated } from '../../auth';
import { useTranslate } from '../../i18n';
import { useNotify } from '../../sideEffect';
import { useGetMainList, Refetch } from '../../dataProvider';
import { SORT_ASC } from '../../reducer/admin/resource/list/queryReducer';
import { CRUD_GET_LIST } from '../../actions';
import { defaultExporter } from '../../export';
import {
    FilterPayload,
    SortPayload,
    RecordMap,
    Identifier,
    Record,
    Exporter,
} from '../../types';
import {
    useResourceContext,
    useResourceDefinition,
    useGetResourceLabel,
} from '../../core';
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
    props: ListControllerProps = {}
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
    } = props;
    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    const { hasCreate } = useResourceDefinition(props);

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
    const {
        ids,
        data,
        total,
        error,
        loading,
        loaded,
        refetch,
    } = useGetMainList<RecordType>(
        resource,
        {
            page: query.page,
            perPage: query.perPage,
        },
        { field: query.sort, order: query.order },
        { ...query.filter, ...filter },
        {
            action: CRUD_GET_LIST,
            onFailure: error =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning',
                    {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    }
                ),
        }
    );

    const totalPages = Math.ceil(total / query.perPage) || 1;

    useEffect(() => {
        if (
            query.page <= 0 ||
            (!loading && query.page > 1 && ids.length === 0)
        ) {
            // Query for a page that doesn't exist, set page to 1
            queryModifiers.setPage(1);
        } else if (!loading && query.page > totalPages) {
            // Query for a page out of bounds, set page to the last existing page
            // It occurs when deleting the last element of the last page
            queryModifiers.setPage(totalPages);
        }
    }, [loading, query.page, ids, queryModifiers, total, totalPages]);

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
        hasCreate,
        hideFilter: queryModifiers.hideFilter,
        ids,
        loaded: loaded || ids.length > 0,
        loading,
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

export interface ListControllerProps {
    disableAuthentication?: boolean;
    // the props you can change
    filter?: FilterPayload;
    filters?: ReactElement | ReactElement[];
    filterDefaultValues?: object;
    perPage?: number;
    sort?: SortPayload;
    exporter?: Exporter | false;
    // the props managed by react-admin
    debounce?: number;
    location?: Location;
    path?: string;
    resource?: string;
    // Whether to disable the synchronization of the list parameters
    // with the current location (URL search parameters)
    disableSyncWithLocation?: boolean;
    [key: string]: any;
}

const defaultSort = {
    field: 'id',
    order: SORT_ASC,
};

export interface ListControllerResult<RecordType extends Record = Record> {
    currentSort: SortPayload;
    data: RecordMap<RecordType>;
    defaultTitle?: string;
    displayedFilters: any;
    error?: any;
    exporter?: Exporter | false;
    filter?: FilterPayload;
    filterValues: any;
    hasCreate?: boolean;
    hideFilter: (filterName: string) => void;
    ids: Identifier[];
    loading: boolean;
    loaded: boolean;
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
    'hasCreate',
    'hideFilter',
    'ids',
    'loading',
    'loaded',
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
