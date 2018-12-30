import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sanitizeListRestProps } from 'ra-core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridBody from './DatagridBody';
import DatagridLoading from './DatagridLoading';

const styles = theme => ({
    table: {
        tableLayout: 'auto',
    },
    tbody: {
        height: 'inherit',
    },
    headerCell: {
        padding: '0 12px',
        '&:last-child': {
            padding: '0 12px',
        },
    },
    checkbox: {},
    row: {},
    clickableRow: {
        cursor: 'pointer',
    },
    rowEven: {},
    rowOdd: {},
    rowCell: {
        padding: '0 12px',
        '&:last-child': {
            padding: '0 12px',
        },
    },
    expandHeader: {
        padding: 0,
        width: 48,
    },
    expandIconCell: {
        width: 48,
    },
    expandIcon: {
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        transform: 'rotate(0deg)',
    },
});

/**
 * The Datagrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - rowStyle
 *
 * @example Display all posts as a datagrid
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <Datagrid rowStyle={postRowStyle}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 *
 * @example Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 */
class Datagrid extends Component {
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
            basePath,
            body,
            children,
            classes,
            className,
            currentSort,
            data,
            expand,
            hasBulkActions,
            hover,
            ids,
            isLoading,
            loadedOnce,
            onSelect,
            onToggleItem,
            resource,
            rowClick,
            rowStyle,
            selectedIds,
            setSort,
            total,
            version,
            ...rest
        } = this.props;

        if (loadedOnce === false) {
            return (
                <DatagridLoading
                    classes={classes}
                    className={className}
                    expand={expand}
                    hasBulkActions={hasBulkActions}
                    nbChildren={React.Children.count(children)}
                />
            );
        }

        if (!isLoading && (ids.length === 0 || total === 0)) {
            return null;
        }

        return (
            <Table
                className={classnames(classes.table, className)}
                {...sanitizeListRestProps(rest)}
            >
                <TableHead>
                    <TableRow className={classes.row}>
                        {expand && (
                            <TableCell className={classes.expandHeader} />
                        )}
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
                                            field.props.source ===
                                            currentSort.field
                                        }
                                        key={field.props.source || index}
                                        resource={resource}
                                        updateSort={this.updateSort}
                                    />
                                ) : null
                        )}
                    </TableRow>
                </TableHead>
                {React.cloneElement(
                    body,
                    {
                        basePath,
                        classes,
                        expand,
                        rowClick,
                        data,
                        hasBulkActions,
                        hover,
                        ids,
                        isLoading,
                        onToggleItem,
                        resource,
                        rowStyle,
                        selectedIds,
                        version,
                    },
                    children
                )}
            </Table>
        );
    }
}

Datagrid.propTypes = {
    basePath: PropTypes.string,
    body: PropTypes.element.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    data: PropTypes.object.isRequired,
    expand: PropTypes.node,
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    setSort: PropTypes.func,
    total: PropTypes.number,
    version: PropTypes.number,
};

Datagrid.defaultProps = {
    data: {},
    hasBulkActions: false,
    ids: [],
    selectedIds: [],
    body: <DatagridBody />,
};

export default withStyles(styles)(Datagrid);
