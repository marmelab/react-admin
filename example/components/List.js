import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import Pagination from '../../src/list/pagination/Pagination';
import { queryParameters } from '../../src/util/fetch';
import { fetchList } from '../../src/list/data/actions';
import { setSort } from '../../src/list/sort/actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.updateSort = this.updateSort.bind(this);
    }

    componentDidMount() {
        this.props.fetchListAction(this.props.resource, this.getPath(this.props.params));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.sort.field !== this.props.params.sort.field
         || nextProps.params.sort.order !== this.props.params.sort.order
         || nextProps.params.sort.filter !== this.props.params.sort.filter
         || nextProps.params.pagination.page !== this.props.params.pagination.page) {
            this.props.fetchListAction(this.props.resource, this.getPath(nextProps.params));
        }
    }

    getPath(params) {
        const { page, perPage } = params.pagination;
        const query = {
            sort: JSON.stringify([params.sort.field, params.sort.order]),
            range: `[${(page - 1) * perPage},${page * perPage - 1}]`,
        };
        if (params.filter) {
            query._filter = params.filter;
        }
        return `${this.props.path}?${queryParameters(query)}`;
    }

    refresh(event) {
        event.stopPropagation();
        this.props.fetchListAction(this.props.resource, this.getPath(this.props.params));
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSortAction(this.props.resource, event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, title, data, children, params } = this.props;
        return (
            <Card style={{margin: '2em'}}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <FlatButton label="Refresh" onClick={this.refresh} icon={<NavigationRefresh/>} />
                </CardActions>
                <CardTitle title={title} />
                <Table multiSelectable>
                    <TableHeader>
                        <TableRow>
                            {React.Children.map(children, child => (
                                <TableHeaderColumn key={child.props.label}>
                                    <FlatButton labelPosition="before" onClick={this.updateSort} data-sort={child.props.source} label={child.props.label} icon={child.props.source == params.sort.field ? <ContentSort style={{ height:'78px', color: 'red', transform: 'rotate(180deg)' }}/> : false} />
                                </TableHeaderColumn>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody showRowHover stripedRows>
                        {data.allIds.map(id => (
                            <TableRow key={id}>
                                {React.Children.map(children, column => (
                                    <TableRowColumn key={`${id}-${column.props.source}`}>
                                        <column.type { ...column.props } record={data.byId[id]} />
                                    </TableRowColumn>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination resource={resource} page={params.pagination.page} perPage={params.pagination.perPage} total={params.pagination.total} />
            </Card>
        );
    }
}

App.propTypes = {
    resource: PropTypes.string.isRequired,
    title: PropTypes.string,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    fetchListAction: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return { params: state[props.resource].list, data: state[props.resource].data };
}

export default connect(
  mapStateToProps,
  { fetchListAction: fetchList, setSortAction: setSort },
)(App);
