import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { crudUpdate, startUndoable, changeListParams } from 'ra-core';

const styles = theme => ({
    main: {
        fontFamily: theme.typography.fontFamily,
        fontSize: 14,
        lineHeight: '1.428571429',
        '& *, &:before, &:after': {
            boxSizing: 'border-box',
        },
        '& .widget-HeaderCell__value': {
            margin: 0,
            padding: 0,
        },
        '& .react-grid-HeaderCell__draggable': {
            margin: 0,
            padding: 0,
        },
    },
});

const emptyRow = {};

class EditableDatagrid extends Component {
    static defaultProps = {
        columns: [],
        data: {},
        hasBulkActions: false,
        ids: [],
        selectedIds: [],
        pageSize: 25,
    };

    constructor(props) {
        super(props);
        this.perPageInitial = this.props.perPage;
        this.loading = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.ids.length !== this.props.ids.length) {
            this.loading = false;
        }
    }

    componentWillUnmount() {
        this.props.changeListParams(this.props.resource, {
            ...this.props.params,
            perPage: this.perPageInitial,
        });
    }

    rowGetter = index => {
        const { data, ids, perPage, pageSize, setPerPage } = this.props;
        if (data[ids[index]]) {
            return data[ids[index]];
        }
        // ReactDataGrid doesn't support lazy loading
        // https://github.com/adazzle/react-data-grid/issues/152
        // and React complains if render() causes side effects
        // so we use setImmediate()
        if (!this.loading) {
            setImmediate(() => {
                setPerPage(perPage + pageSize);
            });
            this.loading = true;
        }
        return emptyRow;
    };

    handleGridSort = (sortColumn, sortDirection) => {
        this.props.setSort(sortColumn, sortDirection);
    };

    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        const {
            ids,
            data,
            startUndoable,
            dispatchCrudUpdate,
            undoable = true,
        } = this.props;
        for (let i = fromRow; i <= toRow; i++) {
            const id = ids[i];
            let rowToUpdate = data[id];
            if (undoable) {
                startUndoable(
                    crudUpdate(
                        this.props.resource,
                        id,
                        updated,
                        rowToUpdate,
                        '',
                        false
                    ),
                    false // prevent refresh, which would force a remount and loose selected cell
                );
            } else {
                dispatchCrudUpdate(
                    this.props.resource,
                    id,
                    updated,
                    rowToUpdate,
                    '',
                    false
                );
            }
        }
    };

    handleRowSelect = rows => {
        this.props.onSelect(rows.map(row => row.id));
    };

    render() {
        const {
            classes,
            columns,
            currentSort,
            hasBulkActions,
            minHeight,
            total,
        } = this.props;
        if (typeof total == 'undefined') {
            return null;
        }
        return (
            <div className={classes.main}>
                <ReactDataGrid
                    className="toto"
                    enableRowSelect={hasBulkActions}
                    enableCellSelect={true}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={total}
                    sortColumn={currentSort.field}
                    sortDirection={currentSort.order}
                    onRowSelect={this.handleRowSelect}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    onGridSort={this.handleGridSort}
                    minHeight={minHeight}
                />
            </div>
        );
    }
}

EditableDatagrid.defaultProps = {
    minHeight: 500,
};

const mapStateToProps = (state, props) => ({
    params: state.admin.resources[props.resource].list.params,
});

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        {
            changeListParams,
            dispatchCrudUpdate: crudUpdate,
            startUndoable,
        }
    )
)(EditableDatagrid);
