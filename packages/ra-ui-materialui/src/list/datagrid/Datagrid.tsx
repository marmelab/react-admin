import * as React from 'react';
import {
    isValidElement,
    Children,
    cloneElement,
    useCallback,
    FC,
    ReactElement,
} from 'react';
import PropTypes from 'prop-types';
import {
    sanitizeListRestProps,
    useListContext,
    useVersion,
    Identifier,
    Record,
} from 'ra-core';
import {
    Checkbox,
    Table,
    TableProps,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';
import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridLoading from './DatagridLoading';
import DatagridBody, { PureDatagridBody } from './DatagridBody';
import useDatagridStyles from './useDatagridStyles';
import { ClassesOverride } from '../../types';

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
const Datagrid: FC<DatagridProps> = React.forwardRef((props, ref) => {
    const classes = useDatagridStyles(props);
    const {
        optimized = false,
        body = optimized ? <PureDatagridBody /> : <DatagridBody />,
        children,
        classes: classesOverride,
        className,
        expand,
        hasBulkActions = false,
        hover,
        isRowSelectable,
        resource,
        rowClick,
        rowStyle,
        size = 'small',
        ...rest
    } = props;

    const {
        basePath,
        currentSort,
        data,
        ids,
        loaded,
        onSelect,
        onToggleItem,
        selectedIds,
        setSort,
        total,
    } = useListContext(props);
    const version = useVersion();

    const updateSort = useCallback(
        event => {
            event.stopPropagation();
            const newField = event.currentTarget.dataset.field;
            const newOrder =
                currentSort.field === newField
                    ? currentSort.order === 'ASC'
                        ? 'DESC'
                        : 'ASC'
                    : event.currentTarget.dataset.order;

            setSort(newField, newOrder);
        },
        [currentSort.field, currentSort.order, setSort]
    );

    const handleSelectAll = useCallback(
        event => {
            if (event.target.checked) {
                const all = ids.concat(
                    selectedIds.filter(id => !ids.includes(id))
                );
                onSelect(
                    isRowSelectable
                        ? all.filter(id => isRowSelectable(data[id]))
                        : all
                );
            } else {
                onSelect([]);
            }
        },
        [data, ids, onSelect, isRowSelectable, selectedIds]
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

    const all = isRowSelectable
        ? ids.filter(id => isRowSelectable(data[id]))
        : ids;

    /**
     * After the initial load, if the data for the list isn't empty,
     * and even if the data is refreshing (e.g. after a filter change),
     * the datagrid displays the current data.
     */
    return (
        <Table
            ref={ref}
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
                            className={classnames(
                                classes.headerCell,
                                classes.expandHeader
                            )}
                        />
                    )}
                    {hasBulkActions && (
                        <TableCell
                            padding="checkbox"
                            className={classes.headerCell}
                        >
                            <Checkbox
                                className="select-all"
                                color="primary"
                                checked={
                                    selectedIds.length > 0 &&
                                    all.length > 0 &&
                                    all.every(id => selectedIds.includes(id))
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
                                    ((field.props as any).sortBy ||
                                        (field.props as any).source)
                                }
                                key={(field.props as any).source || index}
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
                    isRowSelectable,
                    version,
                },
                children
            )}
        </Table>
    );
});

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
    data: PropTypes.object,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any),
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    setSort: PropTypes.func,
    total: PropTypes.number,
    version: PropTypes.number,
    isRowSelectable: PropTypes.func,
};

type RowClickFunction = (
    id: Identifier,
    basePath: string,
    record: Record
) => string;

export interface DatagridProps extends Omit<TableProps, 'size' | 'classes'> {
    body?: ReactElement;
    classes?: ClassesOverride<typeof useDatagridStyles>;
    className?: string;
    expand?:
        | ReactElement
        | FC<{
              basePath: string;
              id: Identifier;
              record: Record;
              resource: string;
          }>;
    hasBulkActions?: boolean;
    hover?: boolean;
    isRowSelectable?: (record: Record) => boolean;
    optimized?: boolean;
    rowClick?: string | RowClickFunction;
    rowStyle?: (record: Record, index: number) => any;
    size?: 'medium' | 'small';
}

export default Datagrid;
