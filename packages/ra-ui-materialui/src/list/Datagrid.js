import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeListRestProps } from 'ra-core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';

import classnames from 'classnames';

import DatagridHeader from './DatagridHeader';
import DatagridBody from './DatagridBody';

const styles = {
    table: {
        tableLayout: 'auto',
    },
    tbody: {
        height: 'inherit',
    },
    headerCell: {
        padding: '0 12px',
    },
    checkbox: {},
    row: {},
    rowEven: {},
    rowOdd: {},
    rowCell: {
        padding: '0 12px',
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
const Datagrid = ({
    basePath,
    data,
    children,
    classes,
    className,
    currentSort,
    hasBulkActions,
    hover,
    ids,
    isLoading,
    resource,
    rowStyle,
    selectedIds,
    setSort,
    onSelect,
    onToggleItem,
    total,
    version,
    ...rest
}) => {
    if (!isLoading && (ids.length === 0 || total === 0)) {
        return null;
    }

    return (
        <Table
            className={classnames(classes.table, className)}
            {...sanitizeListRestProps(rest)}
        >
            <DatagridHeader
                classes={classes}
                currentSort={currentSort}
                hasBulkActions={hasBulkActions}
                ids={ids}
                onSelect={onSelect}
                resource={resource}
                selectedIds={selectedIds}
                setSort={setSort}
            >
                {children}
            </DatagridHeader>
            <DatagridBody
                basePath={basePath}
                classes={classes}
                data={data}
                hasBulkActions={hasBulkActions}
                hover={hover}
                ids={ids}
                onToggleItem={onToggleItem}
                resource={resource}
                rowStyle={rowStyle}
                selectedIds={selectedIds}
                version={version}
            >
                {children}
            </DatagridBody>
        </Table>
    );
};

Datagrid.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    data: PropTypes.object.isRequired,
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
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
};

export default withStyles(styles)(Datagrid);
