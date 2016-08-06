import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import inflection from 'inflection';
import Title from '../layout/Title';
import Pagination from './Pagination';
import CreateButton from '../button/CreateButton';
import { crudGetList as crudGetListAction } from '../../actions/dataActions';
import { setSort as setSortAction } from '../../actions/sortActions';

class Datagrid extends Component {
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

    // FIXME Seems that the cloneElement in CrudRoute slices the children array, which makes this necessary to avoid rerenders
    shouldComponentUpdate(nextProps) {
        return nextProps.children.every((child, index) => child === this.props.children[index]);
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
        const { resource, hasCreate, title, data, ids, children, params, isLoading } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    {hasCreate ? <CreateButton basePath={basePath} /> : undefined}
                    <FlatButton label="Refresh" onClick={::this.refresh} icon={<NavigationRefresh />} />
                </CardActions>
                <CardTitle title={<Title title={title} defaultTitle={`${inflection.humanize(inflection.pluralize(resource))} List`} />} />
                <Table multiSelectable>
                    <TableHeader>
                        <TableRow>
                            {React.Children.map(children, child => (
                                <TableHeaderColumn key={child.props.label}>
                                    <FlatButton labelPosition="before" onClick={::this.updateSort} data-sort={child.props.source} label={child.props.label} icon={child.props.source == params.sort.field ? <ContentSort style={{ height: '78px', color: 'red', transform: 'rotate(180deg)' }} /> : false} />
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
    title: PropTypes.any,
    resource: PropTypes.string.isRequired,
    hasCreate: PropTypes.bool.isRequired,
    hasEdit: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    ids: PropTypes.array,
    data: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    crudGetList: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    const resourceState = state.admin[props.resource];
    return {
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
    };
}

export default connect(
  mapStateToProps,
  { crudGetList: crudGetListAction, setSort: setSortAction },
)(Datagrid);
