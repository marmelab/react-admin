import {
    isValidElement,
    ReactNode,
    ReactElement,
    useCallback,
    useState,
    useEffect,
} from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push } from 'connected-react-router';
import inflection from 'inflection';
import debounceFunction from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';

import removeEmpty from '../util/removeEmpty';
import queryReducer, {
    SET_SORT,
    SET_PAGE,
    SET_PER_PAGE,
    SET_FILTER,
    SORT_ASC,
} from '../reducer/admin/resource/list/queryReducer';
import { crudGetList } from '../actions/dataActions';
import {
    changeListParams,
    setListSelectedIds,
    toggleListItem,
    ListParams,
} from '../actions/listActions';
import removeKey from '../util/removeKey';
import { useCheckMinimumRequiredProps } from './checkMinimumRequiredProps';
import {
    Sort,
    AuthProvider,
    RecordMap,
    Identifier,
    Translate,
    ReduxState,
} from '../types';
import { Location } from 'history';
import { useTranslate } from '../i18n';

interface ChildrenFuncParams {
    basePath: string;
    currentSort: Sort;
    data: RecordMap;
    defaultTitle: string;
    displayedFilters: any;
    filterValues: any;
    hasCreate: boolean;
    hideFilter: (filterName: string) => void;
    ids: Identifier[];
    isLoading: boolean;
    loadedOnce: boolean;
    onSelect: (ids: Identifier[]) => void;
    onToggleItem: (id: Identifier) => void;
    onUnselectItems: () => void;
    page: number;
    perPage: number;
    resource: string;
    selectedIds: Identifier[];
    setFilters: (filters: any) => void;
    setPage: (page: number) => void;
    setPerPage: (page: number) => void;
    setSort: (sort: Sort) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
    translate: Translate;
    total: number;
    version: number;
}

interface Props {
    // the props you can change
    children: (params: ChildrenFuncParams) => ReactNode;
    filter?: object;
    filters?: ReactElement<any>;
    filterDefaultValues?: object;
    pagination?: ReactElement<any>;
    perPage?: number;
    sort?: Sort;
    // the props managed by react-admin
    authProvider?: AuthProvider;
    basePath: string;
    debounce?: number;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    location: Location;
    path?: string;
    query: ListParams;
    resource: string;
    [key: string]: any;
}

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * In Redux terms, <List> is a connected component, and <Datagrid> is a dumb component.
 *
 * Props:
 *   - title
 *   - perPage
 *   - sort
 *   - filter (the permanent filter to apply to the query)
 *   - actions
 *   - filters (a React Element used to display the filter form)
 *   - pagination
 *
 * @example
 *     const PostFilter = (props) => (
 *         <Filter {...props}>
 *             <TextInput label="Search" source="q" alwaysOn />
 *             <TextInput label="Title" source="title" />
 *         </Filter>
 *     );
 *     export const PostList = (props) => (
 *         <List {...props}
 *             title="List of posts"
 *             sort={{ field: 'published_at' }}
 *             filter={{ is_published: true }}
 *             filters={<PostFilter />}
 *         >
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="title" />
 *                 <EditButton />
 *             </Datagrid>
 *         </List>
 *     );
 */
const ListController = (props: Props) => {
    useCheckMinimumRequiredProps(
        'List',
        ['basePath', 'location', 'resource'],
        props
    );

    const {
        basePath,
        children,
        resource,
        hasCreate,
        location,
        filterDefaultValues,
        sort = {
            field: 'id',
            order: SORT_ASC,
        },
        perPage = 10,
        filter,
        debounce = 500,
    } = props;

    const [state, setState] = useState({});
    const dispatch = useDispatch();
    const translate = useTranslate();
    const isLoading = useSelector(
        (reduxState: ReduxState) => reduxState.admin.loading > 0
    );

    const version = useSelector(
        (reduxState: ReduxState) => reduxState.admin.ui.viewVersion
    );

    const { params, ids, loadedOnce, selectedIds, total } = useSelector(
        (reduxState: ReduxState) => reduxState.admin.resources[resource].list,
        [resource]
    );

    const query = getQuery({
        location,
        params,
        filterDefaultValues,
        sort,
        perPage,
    });
    const data = useSelector(
        (reduxState: ReduxState) => reduxState.admin.resources[resource].data,
        [JSON.stringify(query)]
    );

    const changeParams = useCallback(
        action => {
            const newParams = queryReducer(query, action);
            dispatch(
                push({
                    ...location,
                    search: `?${stringify({
                        ...newParams,
                        filter: JSON.stringify(newParams.filter),
                    })}`,
                })
            );
            dispatch(changeListParams(resource, newParams));
        },
        [resource, JSON.stringify(query), JSON.stringify(location)]
    );

    const setSort = useCallback(
        newSort => changeParams({ type: SET_SORT, payload: { sort: newSort } }),
        []
    );

    const setPage = useCallback(
        page => changeParams({ type: SET_PAGE, payload: page }),
        []
    );

    const setPerPage = useCallback(
        newPerPage => changeParams({ type: SET_PER_PAGE, payload: newPerPage }),
        []
    );

    if (filter && isValidElement(filter)) {
        throw new Error(
            '<List> received a React element as `filter` props. If you intended to set the list filter elements, use the `filters` (with an s) prop instead. The `filter` prop is internal and should not be set by the developer.'
        );
    }
    if (!query.page && !(ids || []).length && params.page > 1 && total > 0) {
        setPage(params.page - 1);
        return;
    }

    const filterValues = getFilterValues(query);

    const resourceName = translate(`resources.${resource}.name`, {
        smart_count: 2,
        _: inflection.humanize(inflection.pluralize(resource)),
    });
    const defaultTitle = translate('ra.page.list', {
        name: resourceName,
    });

    const setFilters = useCallback(
        debounceFunction(filters => {
            if (isEqual(filters, filterValues)) {
                return;
            }

            // fix for redux-form bug with onChange and enableReinitialize
            const filtersWithoutEmpty = removeEmpty(filters);
            changeParams({
                type: SET_FILTER,
                payload: filtersWithoutEmpty,
            });
        }, debounce),
        [JSON.stringify(filterValues)]
    );

    const hideFilter = useCallback(
        (filterName: string) => {
            setState({ [filterName]: false });
            const newFilters = removeKey(filterValues, filterName);
            setFilters(newFilters);
        },
        [JSON.stringify(filterValues)]
    );

    const showFilter = useCallback(
        (filterName: string, defaultValue: any) => {
            setState({ [filterName]: true });
            if (typeof defaultValue !== 'undefined') {
                setFilters({
                    ...filterValues,
                    [filterName]: defaultValue,
                });
            }
        },
        [JSON.stringify(filterValues)]
    );

    const handleSelect = useCallback(
        (newIds: Identifier[]) => {
            dispatch(setListSelectedIds(resource, newIds));
        },
        [resource]
    );

    const handleUnselectItems = useCallback(() => {
        dispatch(setListSelectedIds(resource, []));
    }, [resource]);

    const handleToggleItem = useCallback(
        (id: Identifier) => {
            dispatch(toggleListItem(resource, id));
        },
        [resource]
    );

    useEffect(() => {
        const pagination = {
            page: query.page,
            perPage: query.perPage,
        };
        const permanentFilter = filter;
        dispatch(
            crudGetList(
                resource,
                pagination,
                { field: query.sort, order: query.order },
                { ...query.filter, ...permanentFilter }
            )
        );
    }, [JSON.stringify(query)]);

    return children({
        basePath,
        currentSort: {
            field: query.sort,
            order: query.order,
        },
        data,
        defaultTitle,
        displayedFilters: state,
        filterValues,
        hasCreate,
        ids,
        isLoading,
        loadedOnce,
        onSelect: handleSelect,
        onToggleItem: handleToggleItem,
        onUnselectItems: handleUnselectItems,
        page: getNumberOrDefault(query.page, 1),
        perPage: getNumberOrDefault(query.perPage, 10),
        resource,
        selectedIds,
        setFilters,
        hideFilter,
        showFilter,
        setPage,
        setPerPage,
        setSort,
        translate,
        total,
        version,
    });
};

const validQueryParams = ['page', 'perPage', 'sort', 'order', 'filter'];

const parseQueryFromLocation = ({ search }) => {
    const query = pickBy(
        parse(search),
        (v, k) => validQueryParams.indexOf(k) !== -1
    );
    if (query.filter && typeof query.filter === 'string') {
        try {
            query.filter = JSON.parse(query.filter);
        } catch (err) {
            delete query.filter;
        }
    }
    return query;
};

/**
 * Check if user has already set custom sort, page, or filters for this list
 *
 * User params come from the Redux store as the params props. By default,
 * this object is:
 *
 * { filter: {}, order: null, page: 1, perPage: null, sort: null }
 *
 * To check if the user has custom params, we must compare the params
 * to these initial values.
 *
 * @param {object} params
 */
const hasCustomParams = (params: ListParams) => {
    return (
        params &&
        params.filter &&
        (Object.keys(params.filter).length > 0 ||
            params.order != null ||
            params.page !== 1 ||
            params.perPage != null ||
            params.sort != null)
    );
};

/**
 * Merge list params from 4 different sources:
 *   - the query string
 *   - the params stored in the state (from previous navigation)
 *   - the filter defaultValues
 *   - the props passed to the List component
 */
const getQuery = ({ location, params, filterDefaultValues, sort, perPage }) => {
    const queryFromLocation = parseQueryFromLocation(location);
    const query: Partial<ListParams> =
        Object.keys(queryFromLocation).length > 0
            ? queryFromLocation
            : hasCustomParams(params)
            ? { ...params }
            : { filter: filterDefaultValues || {} };

    if (!query.sort) {
        query.sort = sort.field;
        query.order = sort.order;
    }
    if (!query.perPage) {
        query.perPage = perPage;
    }
    if (!query.page) {
        query.page = 1;
    }
    return query as ListParams;
};

const getFilterValues = (query: ListParams) => {
    return query.filter || {};
};

const getNumberOrDefault = (
    possibleNumber: string | number | undefined,
    defaultValue: number
) =>
    (typeof possibleNumber === 'string'
        ? parseInt(possibleNumber, 10)
        : possibleNumber) || defaultValue;

const injectedProps = [
    'basePath',
    'currentSort',
    'data',
    'defaultTitle',
    'displayedFilters',
    'filterValues',
    'hasCreate',
    'hideFilter',
    'ids',
    'isLoading',
    'loadedOnce',
    'onSelect',
    'onToggleItem',
    'onUnselectItems',
    'page',
    'perPage',
    'refresh',
    'resource',
    'selectedIds',
    'setFilters',
    'setPage',
    'setPerPage',
    'setSort',
    'showFilter',
    'total',
    'translate',
    'version',
];

/**
 * Select the props injected by the ListController
 * to be passed to the List children need
 * This is an implementation of pick()
 */
export const getListControllerProps = props =>
    injectedProps.reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

/**
 * Select the props not injected by the ListController
 * to be used inside the List children to sanitize props injected by List
 * This is an implementation of omit()
 */
export const sanitizeListRestProps = props =>
    Object.keys(props)
        .filter(propName => !injectedProps.includes(propName))
        .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

export default ListController;
