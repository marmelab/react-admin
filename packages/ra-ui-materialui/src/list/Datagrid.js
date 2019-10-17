import React, {
    isValidElement,
    Children,
    cloneElement,
    useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { sanitizeListRestProps } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridLoading from './DatagridLoading';
import DatagridBody, { PureDatagridBody } from './DatagridBody';

const useStyles = makeStyles(theme => ({
    table: {
        tableLayout: 'auto',
    },
    thead: {},
    tbody: {},
    headerRow: {},
    headerCell: {},
    checkbox: {},
    row: {},
    clickableRow: {
        cursor: 'pointer',
    },
    rowEven: {},
    rowOdd: {},
    rowCell: {},
    expandHeader: {
        padding: 0,
        width: theme.spacing(6),
    },
    expandIconCell: {
        width: theme.spacing(6),
    },
    expandIcon: {
        padding: theme.spacing(1),
        transform: 'rotate(-90deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        transform: 'rotate(0deg)',
    },
}));

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
function Datagrid({ classes: classesOverride, ...props }) {
    const classes = useStyles({ classes: classesOverride });
    const {
        basePath,
        optimized = false,
        body = optimized ? <PureDatagridBody /> : <DatagridBody />,
        children,
        className,
        currentSort,
        data,
        expand,
        hasBulkActions,
        hover,
        ids,
        loading,
        loaded,
        onSelect,
        onToggleItem,
        resource,
        rowClick,
        rowStyle,
        selectedIds,
        setSort,
        size = 'small',
        total,
        version,
        ...rest
    } = props;

    const updateSort = useCallback(
        event => {
            event.stopPropagation();
            setSort(event.currentTarget.dataset.sort);
        },
        [setSort]
    );

    const handleSelectAll = useCallback(
        event => {
            if (event.target.checked) {
                onSelect(
                    ids.concat(selectedIds.filter(id => !ids.includes(id)))
                );
            } else {
                onSelect([]);
            }
        },
        [ids, onSelect, selectedIds]
    );

    /**
     * if loaded is false, the list displays for the first time, and the dataProvider hasn't answered yet
     * if loaded is true, the data for the list has at least been returned once by the dataProvider
     * if loaded is undefined, the Datagrid parent doesn't track loading state (e.g. ReferenceArrayField)
     */
    if (loaded === false) {
        return (
            <DatagridLoading
                classes={classes}
                className={className}
                expand={expand}
                hasBulkActions={hasBulkActions}
                nbChildren={React.Children.count(children)}
                size={size}
            />
        );
    }

    /**
     * Once loaded, the data for the list may be empty. Instead of
     * displaying the table header with zero data rows,
     * the datagrid displays nothing in this case.
     */
    if (loaded && (ids.length === 0 || total === 0)) {
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
            size={size}
            {...sanitizeListRestProps(rest)}
        >
            <TableHead className={classes.thead}>
                <TableRow
                    className={classnames(classes.row, classes.headerRow)}
                >
                    {expand && (
                        <TableCell
                            padding="none"
                            className={classes.expandHeader}
                        />
                    )}
                    {hasBulkActions && (
                        <TableCell padding="checkbox">
                            <Checkbox
                                className="select-all"
                                color="primary"
                                checked={
                                    selectedIds.length > 0 &&
                                    ids.length > 0 &&
                                    ids.every(id => selectedIds.includes(id))
                                }
                                onChange={handleSelectAll}
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
                                    (field.props.sortBy || field.props.source)
                                }
                                key={field.props.source || index}
                                resource={resource}
                                updateSort={updateSort}
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

Datagrid.propTypes = {
    basePath: PropTypes.string,
    body: PropTypes.element,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    currentSort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.object.isRequired,
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    loading: PropTypes.bool,
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
};

export default Datagrid;
