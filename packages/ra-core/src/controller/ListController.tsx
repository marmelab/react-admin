/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { Component, isValidElement, ReactNode, ReactElement } from 'react';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import inflection from 'inflection';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';

import removeEmpty from '../util/removeEmpty';
import queryReducer, {
    SET_SORT,
    SET_PAGE,
    SET_PER_PAGE,
    SET_FILTER,
    SORT_DESC,
} from '../reducer/admin/resource/list/queryReducer';
import { crudGetList as crudGetListAction } from '../actions/dataActions';
import {
    changeListParams as changeListParamsAction,
    setListSelectedIds as setListSelectedIdsAction,
    toggleListItem as toggleListItemAction,
    ListParams,
} from '../actions/listActions';
import withTranslate from '../i18n/translate';
import removeKey from '../util/removeKey';
import checkMinimumRequiredProps from './checkMinimumRequiredProps';
import {
    Sort,
    AuthProvider,
    RecordMap,
    Identifier,
    Translate,
    Dispatch,
} from '../types';
import { Location, LocationDescriptorObject, LocationState } from 'history';

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
    filters: ReactElement<any>;
    filterDefaultValues: object;
    pagination: ReactElement<any>;
    perPage: number;
    sort: Sort;
    // the props managed by react-admin
    authProvider: AuthProvider;
    basePath: string;
    changeListParams: Dispatch<typeof changeListParamsAction>;
    crudGetList: Dispatch<typeof crudGetListAction>;
    data?: RecordMap;
    debounce: number;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    ids: Identifier[];
    loadedOnce: boolean;
    selectedIds: Identifier[];
    isLoading: boolean;
    location: Location;
    path: string;
    params: ListParams;
    push: (location: LocationDescriptorObject<LocationState>) => void;
    query: ListParams;
    resource: string;
    setSelectedIds: (resource: string, ids: Identifier[]) => void;
    toggleItem: (resource: string, id: Identifier) => void;
    total: number;
    translate: Translate;
    version: number;
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
export class UnconnectedListController extends Component<Props> {
    public static defaultProps: Partial<Props> = {
        debounce: 500,
        filter: {},
        perPage: 10,
        sort: {
            field: 'id',
            order: SORT_DESC,
        },
    };

    state = {};

    setFilters = debounce(filters => {
        if (isEqual(filters, this.getFilterValues())) {
            return;
        }

        // fix for redux-form bug with onChange and enableReinitialize
        const filtersWithoutEmpty = removeEmpty(filters);
        this.changeParams({ type: SET_FILTER, payload: filtersWithoutEmpty });
    }, this.props.debounce);

    componentDidMount() {
        if (this.props.filter && isValidElement(this.props.filter)) {
            throw new Error(
                '<List> received a React element as `filter` props. If you intended to set the list filter elements, use the `filters` (with an s) prop instead. The `filter` prop is internal and should not be set by the developer.'
            );
        }
        if (
            !this.props.query.page &&
            !(this.props.ids || []).length &&
            this.props.params.page > 1 &&
            this.props.total > 0
        ) {
            this.setPage(this.props.params.page - 1);
            return;
        }

        this.updateData();
        if (Object.keys(this.props.query).length > 0) {
            this.props.changeListParams(this.props.resource, this.props.query);
        }
    }

    componentWillUnmount() {
        this.setFilters.cancel();
    }

    componentWillReceiveProps(nextProps: Props) {
        if (
            nextProps.resource !== this.props.resource ||
            nextProps.query.sort !== this.props.query.sort ||
            nextProps.query.order !== this.props.query.order ||
            nextProps.query.page !== this.props.query.page ||
            nextProps.query.perPage !== this.props.query.perPage ||
            !isEqual(nextProps.query.filter, this.props.query.filter) ||
            !isEqual(nextProps.filter, this.props.filter) ||
            !isEqual(nextProps.sort, this.props.sort) ||
            !isEqual(nextProps.perPage, this.props.perPage)
        ) {
            this.updateData(
                Object.keys(nextProps.query).length > 0
                    ? nextProps.query
                    : nextProps.params
            );
        }
        if (nextProps.version !== this.props.version) {
            this.updateData();
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState) {
        if (
            nextProps.translate === this.props.translate &&
            nextProps.isLoading === this.props.isLoading &&
            nextProps.version === this.props.version &&
            nextState === this.state &&
            nextProps.data === this.props.data &&
            nextProps.selectedIds === this.props.selectedIds &&
            nextProps.total === this.props.total
        ) {
            return false;
        }
        return true;
    }

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
    hasCustomParams(params: ListParams) {
        return (
            params &&
            params.filter &&
            (Object.keys(params.filter).length > 0 ||
                params.order != null ||
                params.page !== 1 ||
                params.perPage != null ||
                params.sort != null)
        );
    }

    /**
     * Merge list params from 4 different sources:
     *   - the query string
     *   - the params stored in the state (from previous navigation)
     *   - the filter defaultValues
     *   - the props passed to the List component
     */
    getQuery() {
        const query: Partial<ListParams> =
            Object.keys(this.props.query).length > 0
                ? this.props.query
                : this.hasCustomParams(this.props.params)
                ? { ...this.props.params }
                : { filter: this.props.filterDefaultValues || {} };

        if (!query.sort) {
            query.sort = this.props.sort.field;
            query.order = this.props.sort.order;
        }
        if (!query.perPage) {
            query.perPage = this.props.perPage;
        }
        if (!query.page) {
            query.page = 1;
        }
        return query as ListParams;
    }

    getFilterValues() {
        const query = this.getQuery();
        return query.filter || {};
    }

    updateData(query?: any) {
        const params = query || this.getQuery();
        const { sort, order, page = 1, perPage, filter } = params;
        const pagination = {
            page: parseInt(page, 10),
            perPage: parseInt(perPage, 10),
        };
        const permanentFilter = this.props.filter;
        this.props.crudGetList(
            this.props.resource,
            pagination,
            { field: sort, order },
            { ...filter, ...permanentFilter }
        );
    }

    setSort = sort => this.changeParams({ type: SET_SORT, payload: sort });

    setPage = page => this.changeParams({ type: SET_PAGE, payload: page });

    setPerPage = perPage =>
        this.changeParams({ type: SET_PER_PAGE, payload: perPage });

    showFilter = (filterName: string, defaultValue: any) => {
        this.setState({ [filterName]: true });
        if (typeof defaultValue !== 'undefined') {
            this.setFilters({
                ...this.getFilterValues(),
                [filterName]: defaultValue,
            });
        }
    };

    hideFilter = (filterName: string) => {
        this.setState({ [filterName]: false });
        const newFilters = removeKey(this.getFilterValues(), filterName);
        this.setFilters(newFilters);
    };

    handleSelect = (ids: Identifier[]) => {
        this.props.setSelectedIds(this.props.resource, ids);
    };

    handleUnselectItems = () => {
        this.props.setSelectedIds(this.props.resource, []);
    };

    handleToggleItem = (id: Identifier) => {
        this.props.toggleItem(this.props.resource, id);
    };

    changeParams(action) {
        const newParams = queryReducer(this.getQuery(), action);
        this.props.push({
            ...this.props.location,
            search: `?${stringify({
                ...newParams,
                filter: JSON.stringify(newParams.filter),
            })}`,
        });
        this.props.changeListParams(this.props.resource, newParams);
    }

    render() {
        const {
            basePath,
            children,
            resource,
            hasCreate,
            data,
            ids,
            loadedOnce,
            total,
            isLoading,
            translate,
            version,
            selectedIds,
        } = this.props;
        const query = this.getQuery();
        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 2,
            _: inflection.humanize(inflection.pluralize(resource)),
        });
        const defaultTitle = translate('ra.page.list', {
            name: `${resourceName}`,
        });

        return children({
            basePath,
            currentSort: {
                field: query.sort,
                order: query.order,
            },
            data,
            defaultTitle,
            displayedFilters: this.state,
            filterValues: this.getFilterValues(),
            hasCreate,
            hideFilter: this.hideFilter,
            ids,
            isLoading,
            loadedOnce,
            onSelect: this.handleSelect,
            onToggleItem: this.handleToggleItem,
            onUnselectItems: this.handleUnselectItems,
            page:
                (typeof query.page === 'string'
                    ? parseInt(query.page, 10)
                    : query.page) || 1,
            perPage:
                (typeof query.perPage === 'string'
                    ? parseInt(query.perPage, 10)
                    : query.perPage) || 10,
            resource,
            selectedIds,
            setFilters: this.setFilters,
            setPage: this.setPage,
            setPerPage: this.setPerPage,
            setSort: this.setSort,
            showFilter: this.showFilter,
            translate,
            total,
            version,
        });
    }
}

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

const validQueryParams = ['page', 'perPage', 'sort', 'order', 'filter'];
const getLocationPath = props => props.location.pathname;
const getLocationSearch = props => props.location.search;
const selectQuery = createSelector(
    getLocationPath,
    getLocationSearch,
    (path, search) => {
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
    }
);

function mapStateToProps(state, props) {
    const resourceState = state.admin.resources[props.resource];

    return {
        query: selectQuery(props),
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        loadedOnce: resourceState.list.loadedOnce,
        selectedIds: resourceState.list.selectedIds,
        total: resourceState.list.total,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
        version: state.admin.ui.viewVersion,
    };
}

const ListController = compose(
    checkMinimumRequiredProps('List', ['basePath', 'location', 'resource']),
    connect(
        mapStateToProps,
        {
            crudGetList: crudGetListAction,
            changeListParams: changeListParamsAction,
            setSelectedIds: setListSelectedIdsAction,
            toggleItem: toggleListItemAction,
            push: pushAction,
        }
    ),
    withTranslate
)(UnconnectedListController);

export default ListController;
