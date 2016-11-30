import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import inflection from 'inflection';
import { change as changeFormValueAction, getFormValues } from 'redux-form';
import debounce from 'lodash.debounce';
import queryReducer, { SET_SORT, SET_PAGE, SET_FILTER, SORT_DESC } from '../../reducer/resource/list/queryReducer';
import Title from '../layout/Title';
import Pagination from './Pagination';
import CreateButton from '../button/CreateButton';
import { crudGetList as crudGetListAction } from '../../actions/dataActions';
import { changeListParams as changeListParamsAction } from '../../actions/listActions';

const filterFormName = 'filterForm';

export class List extends Component {
    constructor(props) {
        super(props);
        this.debouncedSetFilters = debounce(this.setFilters.bind(this), 500);
        this.state = {};
    }

    componentDidMount() {
        this.updateData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resource !== this.props.resource
         || nextProps.query.sort !== this.props.query.sort
         || nextProps.query.order !== this.props.query.order
         || nextProps.query.page !== this.props.query.page
         || nextProps.query.filter !== this.props.query.filter) {
            this.updateData(Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params);
        }
        if (Object.keys(nextProps.filters).length === 0 && Object.keys(this.props.filters).length === 0) {
            return;
        }
        if (nextProps.filters !== this.props.filters) {
            const nextFilters = nextProps.filters;
            Object.keys(nextFilters).forEach(filterName => {
                if (nextFilters[filterName] === '') {
                    // remove empty filter from query
                    delete nextFilters[filterName];
                }
            });
            this.debouncedSetFilters(nextFilters);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isLoading === this.props.isLoading && nextState === this.state) {
            return false;
        }
        return true;
    }

    componentWillUnmount() {
        this.debouncedSetFilters.cancel();
    }

    getBasePath() {
        return this.props.location.pathname;
    }

    refresh = (event) => {
        event.stopPropagation();
        this.updateData();
    }

    getQuery() {
        return (Object.keys(this.props.query).length > 0) ? this.props.query : { ...this.props.params };
    }

    getSort(params) {
        const { sort, order } = params;
        const { defaultSort } = this.props;
        return { field: sort || defaultSort.field, order: order || defaultSort.order };
    }

    updateData(query) {
        const params = query || this.getQuery();
        const { page, perPage, filter } = params;
        this.props.crudGetList(this.props.resource, { page, perPage }, this.getSort(params), filter);
    }

    setSort = sort => this.changeParams({ type: SET_SORT, payload: sort });

    setPage = page => this.changeParams({ type: SET_PAGE, payload: page });

    setFilters = filters => this.changeParams({ type: SET_FILTER, payload: filters });

    showFilter = filterName => this.setState({ [filterName]: true });

    hideFilter = (filterName) => {
        this.setState({ [filterName]: false });
        this.props.changeFormValue(filterFormName, filterName, '');
        this.setFilters({ ...this.props.filters, [filterName]: undefined });
    }

    changeParams(action) {
        const newParams = queryReducer(this.getQuery(), action);
        this.props.push({ ...this.props.location, query: { ...newParams, filter: JSON.stringify(newParams.filter) } });
        this.props.changeListParams(this.props.resource, newParams);
    }

    render() {
        const { Filter, resource, hasCreate, title, data, ids, total, children, isLoading } = this.props;
        const query = this.getQuery();
        const filterValues = query.filter;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    {Filter && React.createElement(Filter, {
                        resource,
                        showFilter: this.showFilter,
                        displayedFilters: this.state,
                        filterValues,
                        context: 'button',
                    })}
                    {hasCreate && <CreateButton basePath={basePath} />}
                    <FlatButton primary label="Refresh" onClick={this.refresh} icon={<NavigationRefresh />} />
                </CardActions>
                <CardTitle title={<Title title={title} defaultTitle={`${inflection.humanize(inflection.pluralize(resource))} List`} />} />
                {Filter && React.createElement(Filter, {
                    resource,
                    hideFilter: this.hideFilter,
                    filterValues,
                    displayedFilters: this.state,
                    context: 'form',
                })}
                {React.cloneElement(children, {
                    resource,
                    ids,
                    data,
                    currentSort: this.getSort(query),
                    basePath,
                    setSort: this.setSort,
                })}
                <Pagination resource={resource} page={parseInt(query.page, 10)} perPage={parseInt(query.perPage, 10)} total={total} setPage={this.setPage} />
            </Card>
        );
    }
}

List.propTypes = {
    title: PropTypes.any,
    Filter: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
    filters: PropTypes.object,
    defaultSort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    resource: PropTypes.string.isRequired,
    hasCreate: PropTypes.bool.isRequired,
    hasEdit: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    ids: PropTypes.array,
    total: PropTypes.number.isRequired,
    data: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    crudGetList: PropTypes.func.isRequired,
    changeFormValue: PropTypes.func.isRequired,
    changeListParams: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    push: PropTypes.func.isRequired,
};

List.defaultProps = {
    filters: {},
    defaultSort: {
        field: 'id',
        order: SORT_DESC,
    },
};

function mapStateToProps(state, props) {
    const resourceState = state.admin[props.resource];
    const query = props.location.query;
    if (query.filter && typeof query.filter === 'string') {
        // if the List has no filter component, the filter is always "{}"
        // avoid deserialization and keep identity by using a constant
        query.filter = props.filter ? JSON.parse(query.filter) : resourceState.list.params.filter;
    }
    const Filter = props.filter || props.Filter; // FIXME only for BC with lowercase `filter` name

    return {
        query,
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        total: resourceState.list.total,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
        filters: Filter ? getFormValues(filterFormName)(state) : resourceState.list.params.filter,
        Filter,
    };
}

export default connect(
    mapStateToProps,
    {
        crudGetList: crudGetListAction,
        changeFormValue: changeFormValueAction,
        changeListParams: changeListParamsAction,
        push: pushAction,
    },
)(List);
