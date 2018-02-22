import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';

import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridBody from './DatagridBody';

const styles = {
    table: {
        tableLayout: 'auto',
    },
    tbody: {
        height: 'inherit',
    },
    headerCell: {
        padding: 0,
        '&:first-child': {
            padding: '0 0 0 12px',
        },
    },
    checkbox: {
        height: 'auto',
    },
    row: {},
    rowEven: {},
    rowOdd: {},
    rowCell: {
        padding: '0 12px',
        whiteSpace: 'normal',
        '&:first-child': {
            padding: '0 12px 0 16px',
            whiteSpace: 'normal',
        },
        '&:last-child': {
            padding: '0 12px',
        },
    },
};

/**
 * The Datagrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - styles
 *  - rowStyle
 *  - options (passed as props to <Table>)
 *  - headerOptions (passed as props to mui <TableHead>)
 *  - bodyOptions (passed as props to mui <TableBody>)
 *  - rowOptions (passed as props to mui <TableRow>)
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

    handleSelectAll = () => {
        if (this.props.selectedIds.length > 0) {
            return this.props.onSelect([]);
        }
        this.props.onSelect(this.props.ids);
    };

    render() {
        const {
            basePath,
            data,
            children,
            classes,
            className,
            currentSort,
            hasBulkActions,
            ids,
            isLoading,
            resource,
            rowStyle,
            selectedIds,
            setSort,
            onSelect,
            onToggleItem,
            ...rest
        } = this.props;

        return (
            <Table className={classnames(classes.table, className)} {...rest}>
                <TableHead>
                    <TableRow className={classes.row}>
                        {hasBulkActions && (
                            <TableCell padding="none">
                                <Checkbox
                                    className="select-all"
                                    checked={
                                        ids.length > 0 &&
                                        selectedIds.length === ids.length
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
                <DatagridBody
                    basePath={basePath}
                    classes={classes}
                    data={data}
                    hasBulkActions={hasBulkActions}
                    ids={ids}
                    isLoading={isLoading}
                    onToggleItem={onToggleItem}
                    resource={resource}
                    rowStyle={rowStyle}
                    selectedIds={selectedIds}
                >
                    {children}
                </DatagridBody>
            </Table>
        );
    }
}

Datagrid.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.object.isRequired,
    hasBulkActions: PropTypes.bool.isRequired,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    setSort: PropTypes.func,
};

Datagrid.defaultProps = {
    data: {},
    hasBulkActions: false,
    ids: [],
    selectedIds: [],
};

export default withStyles(styles)(Datagrid);
