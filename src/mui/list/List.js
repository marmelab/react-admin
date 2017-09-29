import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import { Card, CardText } from 'material-ui/Card';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import inflection from 'inflection';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import queryReducer, {
    SET_SORT,
    SET_PAGE,
    SET_FILTER,
    SORT_DESC,
} from '../../reducer/admin/resource/list/queryReducer';
import ViewTitle from '../layout/ViewTitle';
import Title from '../layout/Title';
import DefaultPagination from './Pagination';
import DefaultActions from './Actions';
import { crudGetList as crudGetListAction } from '../../actions/dataActions';
import { changeListParams as changeListParamsAction } from '../../actions/listActions';
import { refreshView as refreshViewAction } from '../../actions/uiActions';
import translate from '../../i18n/translate';
import removeKey from '../../util/removeKey';
import defaultTheme from '../defaultTheme';
import withPermissionsFilteredChildren from '../../auth/withPermissionsFilteredChildren';

const styles = {
    noResults: { padding: 20 },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

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
export class List extends Component {
    state = {};

    componentDidMount() {
        this.updateData();
        if (Object.keys(this.props.query).length > 0) {
            this.props.changeListParams(this.props.resource, this.props.query);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.resource !== this.props.resource ||
            nextProps.query.sort !== this.props.query.sort ||
            nextProps.query.order !== this.props.query.order ||
            nextProps.query.page !== this.props.query.page ||
            nextProps.query.filter !== this.props.query.filter
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

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isLoading === this.props.isLoading &&
            nextProps.width === this.props.width &&
            nextProps.version === this.props.version &&
            nextState === this.state
        ) {
            return false;
        }
        return true;
    }

    getBasePath() {
        return this.props.location.pathname.replace(/\/$/, '');
    }

    /**
     * Merge list params from 3 different sources:
     *   - the query string
     *   - the params stored in the state (from previous navigation)
     *   - the props passed to the List component
     */
    getQuery() {
        const query =
            Object.keys(this.props.query).length > 0
                ? this.props.query
                : { ...this.props.params };
        if (!query.sort) {
            query.sort = this.props.sort.field;
            query.order = this.props.sort.order;
        }
        if (!query.perPage) {
            query.perPage = this.props.perPage;
        }
        return query;
    }

    updateData(query) {
        const params = query || this.getQuery();
        const { sort, order, page, perPage, filter } = params;
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

    setFilters = filters =>
        this.changeParams({ type: SET_FILTER, payload: filters });

    showFilter = (filterName, defaultValue) => {
        this.setState({ [filterName]: true });
        if (typeof defaultValue !== 'undefined') {
            this.setFilters({
                ...this.props.filterValues,
                [filterName]: defaultValue,
            });
        }
    };

    hideFilter = filterName => {
        this.setState({ [filterName]: false });
        const newFilters = removeKey(this.props.filterValues, filterName);
        this.setFilters(newFilters);
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

    refresh() {
        if (process.env !== 'production') {
            console.warn( // eslint-disable-line
                'Deprecation warning: The preferred way to refresh the List view is to connect your custom button with redux and dispatch the `refreshView` action.'
            );
        }

        this.props.refreshView();
    }

    render() {
        const {
            children,
            filters,
            pagination = <DefaultPagination />,
            actions = <DefaultActions />,
            resource,
            hasCreate,
            title,
            data,
            ids,
            total,
            isLoading,
            translate,
            theme,
            version,
        } = this.props;
        const query = this.getQuery();
        const filterValues = query.filter;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 2,
            _: inflection.humanize(inflection.pluralize(resource)),
        });
        const defaultTitle = translate('aor.page.list', {
            name: `${resourceName}`,
        });
        const titleElement = (
            <Title title={title} defaultTitle={defaultTitle} />
        );
        const muiTheme = getMuiTheme(theme);
        const prefix = autoprefixer(muiTheme);

        return (
            <div className="list-page">
                <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                    <div style={prefix(styles.header)}>
                        <ViewTitle title={titleElement} />
                        {actions &&
                            React.cloneElement(actions, {
                                resource,
                                filters,
                                filterValues,
                                basePath,
                                hasCreate,
                                displayedFilters: this.state,
                                showFilter: this.showFilter,
                                theme,
                                refresh: this.refresh,
                            })}
                    </div>
                    {filters &&
                        React.cloneElement(filters, {
                            resource,
                            hideFilter: this.hideFilter,
                            filterValues,
                            displayedFilters: this.state,
                            setFilters: this.setFilters,
                            context: 'form',
                        })}
                    {isLoading || total > 0 ? (
                        <div key={version}>
                            {children &&
                                React.cloneElement(children, {
                                    resource,
                                    ids,
                                    data,
                                    currentSort: {
                                        field: query.sort,
                                        order: query.order,
                                    },
                                    basePath,
                                    isLoading,
                                    setSort: this.setSort,
                                })}
                            {pagination &&
                                React.cloneElement(pagination, {
                                    total,
                                    page: parseInt(query.page, 10),
                                    perPage: parseInt(query.perPage, 10),
                                    setPage: this.setPage,
                                })}
                        </div>
                    ) : (
                        <CardText style={styles.noResults}>
                            {translate('aor.navigation.no_results')}
                        </CardText>
                    )}
                </Card>
            </div>
        );
    }
}

List.propTypes = {
    // the props you can change
    title: PropTypes.any,
    filter: PropTypes.object,
    filters: PropTypes.element,
    pagination: PropTypes.element,
    actions: PropTypes.element,
    perPage: PropTypes.number.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    children: PropTypes.node,
    // the props managed by admin-on-rest
    authClient: PropTypes.func,
    changeListParams: PropTypes.func.isRequired,
    crudGetList: PropTypes.func.isRequired,
    data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    filterValues: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    hasCreate: PropTypes.bool.isRequired,
    ids: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    refreshView: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    version: PropTypes.number.isRequired,
};

List.defaultProps = {
    filter: {},
    filterValues: {},
    perPage: 10,
    sort: {
        field: 'id',
        order: SORT_DESC,
    },
    theme: defaultTheme,
};

const getLocationSearch = props => props.location.search;
const getQuery = createSelector(getLocationSearch, locationSearch => {
    const query = parse(locationSearch);
    if (query.filter && typeof query.filter === 'string') {
        query.filter = JSON.parse(query.filter);
    }
    return query;
});

function mapStateToProps(state, props) {
    const resourceState = state.admin.resources[props.resource];
    return {
        query: getQuery(props),
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        total: resourceState.list.total,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
        filterValues: resourceState.list.params.filter,
        version: state.admin.ui.viewVersion,
    };
}

const enhance = compose(
    connect(mapStateToProps, {
        crudGetList: crudGetListAction,
        changeListParams: changeListParamsAction,
        push: pushAction,
        refreshView: refreshViewAction,
    }),
    translate,
    withPermissionsFilteredChildren
);

export default enhance(List);
