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
        this.props.crudGetList(this.props.resource, this.props.params.pagination, this.props.params.sort, this.props.params.filter.values);
        this.updateSort = this.updateSort.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resource !== this.props.resource
         || nextProps.params.sort.field !== this.props.params.sort.field
         || nextProps.params.sort.order !== this.props.params.sort.order
         || nextProps.params.pagination.page !== this.props.params.pagination.page
         || nextProps.params.filter.values !== this.props.params.filter.values) {
            this.props.crudGetList(nextProps.resource, nextProps.params.pagination, nextProps.params.sort, nextProps.params.filter.values);
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
        this.props.crudGetList(this.props.resource, this.props.params.pagination, this.props.params.sort);
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSort(this.props.resource, event.currentTarget.dataset.sort);
    }

    render() {
        const { filter, resource, hasCreate, title, data, ids, children, params, isLoading } = this.props;
        const basePath = this.getBasePath();
        return (
            <Card style={{ margin: '2em', opacity: isLoading ? .8 : 1 }}>
                <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                    {filter && React.createElement(filter, { resource, context: 'button' })}
                    {hasCreate && <CreateButton basePath={basePath} />}
                    <FlatButton primary label="Refresh" onClick={::this.refresh} icon={<NavigationRefresh />} />
                </CardActions>
                <CardTitle title={<Title title={title} defaultTitle={`${inflection.humanize(inflection.pluralize(resource))} List`} />} />
                {filter && React.createElement(filter, { resource, context: 'form' })}
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
                                            icon={field.props.source === params.sort.field ? <ContentSort style={params.sort.order === 'ASC' ? { transform: 'rotate(180deg)' } : {}} /> : false}
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
                <Pagination resource={resource} page={params.pagination.page} perPage={params.pagination.perPage} total={params.pagination.total} />
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
