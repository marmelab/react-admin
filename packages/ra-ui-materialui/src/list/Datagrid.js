import React, { Component, isValidElement, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { sanitizeListRestProps } from 'ra-core';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridBody from './DatagridBody';
import DatagridLoading from './DatagridLoading';

const styles = theme => createStyles({
    table: {
        tableLayout: 'auto',
    },
    thead: {},
    tbody: {
        height: 'inherit',
    },
    headerRow: {},
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

        /**
         * if loadedOnce is false, the list displays for the first time, and the dataProvider hasn't answered yet
         * if loadedOnce is true, the data for the list has at least been returned once by the dataProvider
         * if loadedOnce is undefined, the Datagrid parent doesn't track loading state (e.g. ReferenceArrayField)
         */
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

        /**
         * Once loaded, the data for the list may be empty. Instead of
         * displaying the table header with zero data rows,
         * the datagrid displays nothing in this case.
         */
        if (!isLoading && (ids.length === 0 || total === 0)) {
            return null;
        }

        /**
         * After the initial load, if the data for the list isn't empty,
         * and even if the data is refreshing (e.g. after a filter change),
         * the datagrid displays the current data.
         */
        return (
            <Table
                className={classnames(classes.table, className)}
                {...sanitizeListRestProps(rest)}
            >
                <TableHead className={classes.thead}>
                    <TableRow
                        className={classnames(classes.row, classes.headerRow)}
                    >
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
                        {Children.map(children, (field, index) =>
                            isValidElement(field) ? (
                                <DatagridHeaderCell
                                    className={classes.headerCell}
                                    currentSort={currentSort}
                                    field={field}
                                    isSorting={
                                        currentSort.field ===
                                        (field.props.sortBy ||
                                            field.props.source)
                                    }
                                    key={field.props.source || index}
                                    resource={resource}
                                    updateSort={this.updateSort}
                                />
                            ) : null
                        )}
                    </TableRow>
                </TableHead>
                {cloneElement(
                    body,
                    {
                        basePath,
                        className: classes.tbody,
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
        field: PropTypes.string,
        order: PropTypes.string,
    }),
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
