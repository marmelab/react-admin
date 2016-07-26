import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import Pagination from './Pagination';
import CreateButton from '../button/CreateButton';
import { crudGetList as crudGetListAction } from '../../../actions/dataActions';
import { setSort as setSortAction } from '../../../actions/sortActions';

class Datagrid extends Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.updateSort = this.updateSort.bind(this);
    }

    componentDidMount() {
        this.props.crudGetList(this.props.resource, this.props.params.pagination, this.props.params.sort);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resource !== this.props.resource
         || nextProps.params.sort.field !== this.props.params.sort.field
         || nextProps.params.sort.order !== this.props.params.sort.order
         || nextProps.params.pagination.page !== this.props.params.pagination.page) {
            this.props.crudGetList(nextProps.resource, nextProps.params.pagination, nextProps.params.sort);
        }
    }

    getBasePath() {
        return this.props.location.pathname;
    }

    refresh(event) {
        event.stopPropagation();
        this.props.crudGetList(this.props.resource, this.props.params.pagination, this.props.params.sort);
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSort(this.props.resource, event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, title, data, ids, children, params } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em' }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    <CreateButton basePath={basePath} />
                    <FlatButton label="Refresh" onClick={this.refresh} icon={<NavigationRefresh />} />
                </CardActions>
                <CardTitle title={title} />
                <Table multiSelectable>
                    <TableHeader>
                        <TableRow>
                            {React.Children.map(children, child => (
                                <TableHeaderColumn key={child.props.label}>
                                    <FlatButton labelPosition="before" onClick={this.updateSort} data-sort={child.props.source} label={child.props.label} icon={child.props.source == params.sort.field ? <ContentSort style={{ height: '78px', color: 'red', transform: 'rotate(180deg)' }} /> : false} />
                                </TableHeaderColumn>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody showRowHover>
                        {ids.map(id => (
                            <TableRow key={id}>
                                {React.Children.map(children, column => (
                                    <TableRowColumn key={`${id}-${column.props.source}`}>
                                        <column.type {...column.props} record={data[id]} basePath={basePath} />
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
    title: PropTypes.string,
    resource: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    ids: PropTypes.array,
    data: PropTypes.object,
    crudGetList: PropTypes.func.isRequired,
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
  { crudGetList: crudGetListAction, setSort: setSortAction },
)(Datagrid);
