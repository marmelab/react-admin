import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import DatagridHeaderCell from './DatagridHeaderCell';

class DatagridHeader extends Component {
    updateSort = event => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    };

    handleSelectAll = event => {
        const { onSelect, ids, selectedIds } = this.props;
        if (event.target.checked) {
            onSelect(
                ids.reduce(
                    (idList, id) =>
                        idList.includes(id) ? idList : idList.concat(id),

                    selectedIds
                )
            );
        } else {
            onSelect([]);
        }
    };

    render() {
        const {
            children,
            classes,
            currentSort,
            hasBulkActions,
            ids,
            resource,
            selectedIds,
        } = this.props;

        return (
            <TableHead>
                <TableRow className={classes.row}>
                    {hasBulkActions && (
                        <TableCell padding="none">
                            <Checkbox
                                className="select-all"
                                color="primary"
                                checked={
                                    selectedIds.length > 0 &&
                                    ids.length > 0 &&
                                    !ids.find(
                                        it => selectedIds.indexOf(it) === -1
                                    )
                                }
                                onChange={this.handleSelectAll}
                            />
                        </TableCell>
                    )}
                    {React.Children.map(
                        children,
                        (field, index) =>
                            field ? (
                                <DatagridHeaderCell
                                    className={classes.headerCell}
                                    currentSort={currentSort}
                                    field={field}
                                    isSorting={
                                        field.props.source === currentSort.field
                                    }
                                    key={field.props.source || index}
                                    resource={resource}
                                    updateSort={this.updateSort}
                                />
                            ) : null
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

DatagridHeader.propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    hasBulkActions: PropTypes.bool.isRequired,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    onSelect: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    setSort: PropTypes.func,
};

DatagridHeader.defaultProps = {
    hasBulkActions: false,
    ids: [],
    selectedIds: [],
};

export default shouldUpdate(
    (props, nextProps) =>
        props.currentSort.field !== nextProps.currentSort.field ||
        props.currentSort.order !== nextProps.currentSort.order ||
        props.selectedIds !== nextProps.selectedIds ||
        props.ids !== nextProps.ids ||
        props.children != nextProps.children
)(DatagridHeader);
