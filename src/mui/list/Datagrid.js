import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push as pushAction } from 'react-router-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import inflection from 'inflection';
import queryReducer, { SET_SORT, SET_PAGE, SET_FILTER } from '../../reducer/resource/list/queryReducer';
import Title from '../layout/Title';
import Pagination from './Pagination';
import CreateButton from '../button/CreateButton';
import { crudGetList as crudGetListAction } from '../../actions/dataActions';
import { changeListParams as changeListParamsAction } from '../../actions/listActions';

class Datagrid extends Component {
    componentDidMount() {
        this.updateData();
        this.updateSort = this.updateSort.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resource !== this.props.resource
         || nextProps.query.sort !== this.props.query.sort
         || nextProps.query.order !== this.props.query.order
         || nextProps.query.page !== this.props.query.page
         || nextProps.query.filter !== this.props.query.filter) {
            this.updateData(Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params);
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.isLoading !== this.props.isLoading;
    }

    getBasePath() {
        return this.props.location.pathname;
    }

    refresh(event) {
        event.stopPropagation();
        this.updateData();
    }

    getQuery() {
        if (Object.keys(this.props.query).length > 0) {
            return this.props.query;
        }
        const query = this.props.params;
        if (typeof query.filter !== 'string') {
            query.filter = JSON.stringify(query.filter);
        }
        return query;
    }

    updateData(query) {
        const { sort, order, page, perPage, filter } = query || this.getQuery();
        this.props.crudGetList(this.props.resource, { page, perPage }, { field: sort, order }, JSON.parse(filter));
    }

    updateSort(event) {
        event.stopPropagation();
        this.changeParams({ type: SET_SORT, payload: event.currentTarget.dataset.sort });
    }

    setPage(page) {
        this.changeParams({ type: SET_PAGE, payload: page });
    }

    setFilter(field, value) {
        this.changeParams({ type: SET_FILTER, payload: { field, value } });
    }

    changeParams(action) {
        const newParams = queryReducer(this.getQuery(), action);
        this.props.push({ ...this.props.location, query: newParams });
        newParams.filter = JSON.parse(newParams.filter);
        this.props.changeListParams(this.props.resource, newParams);
    }

    render() {
        const { filter, resource, hasCreate, title, data, ids, total, children, isLoading } = this.props;
        const query = this.getQuery();
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    {/*filter && React.createElement(filter, { resource, context: 'button' })*/}
                    {hasCreate && <CreateButton basePath={basePath} />}
                    <FlatButton primary label="Refresh" onClick={::this.refresh} icon={<NavigationRefresh />} />
                </CardActions>
                <CardTitle title={<Title title={title} defaultTitle={`${inflection.humanize(inflection.pluralize(resource))} List`} />} />
                {/*filter && React.createElement(filter, { resource, context: 'form' })*/}
                <Table multiSelectable>
                    <TableHeader>
                        <TableRow>
                            {React.Children.map(children, field => (
                                <TableHeaderColumn key={field.props.label}>
                                    {field.props.label &&
                                        <FlatButton
                                            labelPosition="before"
                                            onClick={this.updateSort}
                                            data-sort={field.props.source}
                                            label={field.props.label}
                                            icon={field.props.source === query.sort ? <ContentSort style={query.order === 'ASC' ? { transform: 'rotate(180deg)' } : {}} /> : false}
                                        />
                                    }
                                </TableHeaderColumn>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody showRowHover>
                        {ids.map(id => (
                            <TableRow key={id}>
                                {React.Children.map(children, field => (
                                    <TableRowColumn key={`${id}-${field.props.source}`}>
                                        <field.type {...field.props} record={data[id]} basePath={basePath} />
                                    </TableRowColumn>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination resource={resource} page={parseInt(query.page, 10)} perPage={parseInt(query.perPage, 10)} total={total} setPage={this.setPage} />
            </Card>
        );
    }
}

Datagrid.propTypes = {
    title: PropTypes.any,
    filter: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
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
    changeListParams: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    const resourceState = state.admin[props.resource];
    return {
        query: props.location.query,
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        total: resourceState.list.total,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
    };
}

export default connect(
    mapStateToProps,
    {
        crudGetList: crudGetListAction,
        changeListParams: changeListParamsAction,
        push: pushAction,
    },
)(Datagrid);
