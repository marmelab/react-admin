import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import Pagination from '../pagination/Pagination';
import { crudFetch as crudFetchAction, GET_MANY } from '../../data/actions';
import { setSort as setSortAction } from '../sort/actions';

class Datagrid extends Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.updateSort = this.updateSort.bind(this);
    }

    componentDidMount() {
        this.props.crudFetch(this.props.resource, GET_MANY, this.props.params);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.sort.field !== this.props.params.sort.field
         || nextProps.params.sort.order !== this.props.params.sort.order
         || nextProps.params.sort.filter !== this.props.params.sort.filter
         || nextProps.params.pagination.page !== this.props.params.pagination.page) {
            this.props.crudFetch(this.props.resource, GET_MANY, nextProps.params);
        }
    }

    refresh(event) {
        event.stopPropagation();
        this.props.crudFetch(this.props.resource, GET_MANY, this.props.params);
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSort(this.props.resource, event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, title, data, ids, children, params } = this.props;
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
                    <TableBody showRowHover>
                        {ids.map(id => (
                            <TableRow key={id}>
                                {React.Children.map(children, column => (
                                    <TableRowColumn key={`${id}-${column.props.source}`}>
                                        <column.type { ...column.props } record={data[id]} />
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

Datagrid.propTypes = {
    resource: PropTypes.string.isRequired,
    title: PropTypes.string,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    ids: PropTypes.array,
    data: PropTypes.object,
    crudFetch: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    const resourceState = state[props.resource];
    return {
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        data: resourceState.data,
    };
}

export default connect(
  mapStateToProps,
  { crudFetch: crudFetchAction, setSort: setSortAction },
)(Datagrid);
