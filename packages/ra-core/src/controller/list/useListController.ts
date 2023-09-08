import { isValidElement, useEffect, useMemo } from 'react';
import { UseQueryOptions } from 'react-query';

import { useAuthenticated } from '../../auth';
import { useTranslate } from '../../i18n';
import { useNotify } from '../../notification';
import { useGetList, UseGetListHookValue } from '../../dataProvider';
import { SORT_ASC } from './queryReducer';
import { defaultExporter } from '../../export';
import { FilterPayload, SortPayload, RaRecord, Exporter } from '../../types';
import { useResourceContext, useGetResourceLabel } from '../../core';
import { useRecordSelection } from './useRecordSelection';
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
export const useListController = <RecordType extends RaRecord = any>(
    props: ListControllerProps<RecordType> = {}
): ListControllerResult<RecordType> => {
    const {
        debounce = 500,
        disableAuthentication,
        disableSyncWithLocation,
        exporter = defaultExporter,
        filter,
        filterDefaultValues,
        perPage = 10,
        queryOptions = {},
        sort = defaultSort,
        storeKey,
    } = props;
    useAuthenticated({ enabled: !disableAuthentication });
    const resource = useResourceContext(props);
    const { meta, ...otherQueryOptions } = queryOptions;

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
        debounce,
        disableSyncWithLocation,
        filterDefaultValues,
        perPage,
        resource,
        sort,
        storeKey,
    });

    const [selectedIds, selectionModifiers] = useRecordSelection(resource);

    const {
        data,
        pageInfo,
        total,
        error,
        isLoading,
        isFetching,
        refetch,
    } = useGetList<RecordType>(
        resource,
        {
            pagination: {
                page: query.page,
                perPage: query.perPage,
            },
            sort: { field: query.sort, order: query.order },
            filter: { ...query.filter, ...filter },
            meta,
        },
        {
            keepPreviousData: true,
            retry: false,
            onError: error =>
                notify(error?.message || 'ra.notification.http_error', {
                    type: 'error',
                    messageArgs: {
                        _: error?.message,
                    },
                }),
            ...otherQueryOptions,
        }
    );

    // change page if there is no data
    useEffect(() => {
        if (
            query.page <= 0 ||
            (!isFetching &&
                query.page > 1 &&
                (data == null || data?.length === 0))
        ) {
            // Query for a page that doesn't exist, set page to 1
            queryModifiers.setPage(1);
            return;
        }
        if (total == null) {
            return;
        }
        const totalPages = Math.ceil(total / query.perPage) || 1;
        if (!isFetching && query.page > totalPages) {
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
        sort: currentSort,
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
        hasNextPage: pageInfo
            ? pageInfo.hasNextPage
            : total != null
            ? query.page * query.perPage < total
            : undefined,
        hasPreviousPage: pageInfo ? pageInfo.hasPreviousPage : query.page > 1,
    };
};

export interface ListControllerProps<RecordType extends RaRecord = any> {
    /**
     * The debounce delay for filter queries in milliseconds. Defaults to 500ms.
     *
     * @see https://marmelab.com/react-admin/List.html#debounce
     * @example
     * // wait 1 seconds instead of 500 milliseconds befoce calling the dataProvider
     * const PostList = () => (
     *     <List debounce={1000}>
     *         ...
     *     </List>
     * );
     */
    debounce?: number;

    /**
     * Allow anonymous access to the list view. Defaults to false.
     *
     * @see https://marmelab.com/react-admin/List.html#disableauthentication
     * @example
     * import { List } from 'react-admin';
     *
     * const BoolkList = () => (
     *     <List disableAuthentication>
     *         ...
     *     </List>
     * );
     */
    disableAuthentication?: boolean;

    /**
     * Whether to disable the synchronization of the list parameters with the current location (URL search parameters)
     *
     * @see https://marmelab.com/react-admin/List.html#disablesyncwithlocation
     * @example
     * const Dashboard = () => (
     *     <div>
     *         // ...
     *         <ResourceContextProvider value="posts">
     *             <List disableSyncWithLocation>
     *                 <SimpleList
     *                     primaryText={record => record.title}
     *                     secondaryText={record => `${record.views} views`}
     *                     tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
     *                 />
     *             </List>
     *         </ResourceContextProvider>
     *         <ResourceContextProvider value="comments">
     *             <List disableSyncWithLocation>
     *                 <SimpleList
     *                     primaryText={record => record.title}
     *                     secondaryText={record => `${record.views} views`}
     *                     tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
     *                 />
     *             </List>
     *         </ResourceContextProvider>
     *     </div>
     * )
     */
    disableSyncWithLocation?: boolean;

    /**
     * The function called when a user exports the list
     *
     * @see https://marmelab.com/react-admin/List.html#exporter
     * @example
     * import { List, downloadCSV } from 'react-admin';
     * import jsonExport from 'jsonexport/dist';
     *
     * const exporter = posts => {
     *     const postsForExport = posts.map(post => {
     *         const { backLinks, author, ...postForExport } = post; // omit backLinks and author
     *         postForExport.author_name = post.author.name; // add a field
     *         return postForExport;
     *     });
     *     jsonExport(postsForExport, {
     *         headers: ['id', 'title', 'author_name', 'body'] // order fields in the export
     *     }, (err, csv) => {
     *         downloadCSV(csv, 'posts'); // download as 'posts.csv` file
     *     });
     * };
     *
     * const PostList = () => (
     *     <List exporter={exporter}>
     *         ...
     *     </List>
     * )
     */
    exporter?: Exporter | false;

    /**
     * Permanent filter applied to all getList queries, regardless of the user selected filters.
     *
     * @see https://marmelab.com/react-admin/List.html#filter
     * @example
     * export const PostList = () => (
     *     <List filter={{ is_published: true }}>
     *         ...
     *     </List>
     * );
     */
    filter?: FilterPayload;

    /**
     * The filter to apply when calling getList if the filter is empty.
     *
     * @see https://marmelab.com/react-admin/List.html#filterdefaultvalues
     * @example
     * const postFilters = [
     *     <TextInput label="Search" source="q" alwaysOn />,
     *     <BooleanInput source="is_published" alwaysOn />,
     *     <TextInput source="title" defaultValue="Hello, World!" />,
     * ];
     *
     * export const PostList = () => (
     *     <List filters={postFilters} filterDefaultValues={{ is_published: true }}>
     *         ...
     *     </List>
     * );
     */
    filterDefaultValues?: object;

    /**
     * The number of results per page. Defaults to 10.
     *
     * @see https://marmelab.com/react-admin/List.html#perpage
     * @example
     * export const PostList = () => (
     *     <List perPage={25}>
     *         ...
     *     </List>
     * );
     */
    perPage?: number;

    /**
     * The options passed to react-query's useQuery when calling getList.
     *
     * @see https://marmelab.com/react-admin/List.html#queryoptions
     * @example
     * import { useNotify, useRedirect, List } from 'react-admin';
     *
     * const PostList = () => {
     *     const notify = useNotify();
     *     const redirect = useRedirect();
     *
     *     const onError = (error) => {
     *         notify(`Could not load list: ${error.message}`, { type: 'error' });
     *         redirect('/dashboard');
     *     };
     *
     *     return (
     *         <List queryOptions={{ onError }}>
     *             ...
     *         </List>
     *     );
     * }
     */
    queryOptions?: UseQueryOptions<{
        data: RecordType[];
        total?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
    }> & { meta?: any };

    /**
     * The resource name. Defaults to the resource from ResourceContext.
     *
     * @see https://marmelab.com/react-admin/List.html#resource
     * @example
     * import { List } from 'react-admin';
     *
     * const PostList = () => (
     *    <List resource="posts">
     *       ...
     *   </List>
     * );
     */
    resource?: string;

    /**
     * The default sort field and order. Defaults to { field: 'id', order: 'ASC' }.
     *
     * @see https://marmelab.com/react-admin/List.html#sort
     * @example
     * export const PostList = () => (
     *     <List sort={{ field: 'published_at', order: 'DESC' }}>
     *         ...
     *     </List>
     * );
     */
    sort?: SortPayload;

    /**
     * The key to use to store the current filter & sort. Pass false to disable.
     *
     * @see https://marmelab.com/react-admin/List.html#storekey
     * @example
     * const NewerBooks = () => (
     *     <List
     *         resource="books"
     *         storeKey="newerBooks"
     *         sort={{ field: 'year', order: 'DESC' }}
     *     >
     *         ...
     *     </List>
     * );
     */
    storeKey?: string | false;
}

const defaultSort = {
    field: 'id',
    order: SORT_ASC,
} as const;

export interface ListControllerResult<RecordType extends RaRecord = any> {
    sort: SortPayload;
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
    onSelect: (ids: RecordType['id'][]) => void;
    onToggleItem: (id: RecordType['id']) => void;
    onUnselectItems: () => void;
    page: number;
    perPage: number;
    refetch: (() => void) | UseGetListHookValue<RecordType>['refetch'];
    resource: string;
    selectedIds: RecordType['id'][];
    setFilters: (
        filters: any,
        displayedFilters: any,
        debounce?: boolean
    ) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: SortPayload) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    total: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const injectedProps = [
    'sort',
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
