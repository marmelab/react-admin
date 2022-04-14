import * as React from 'react';
import {
    cloneElement,
    createElement,
    isValidElement,
    useCallback,
    useRef,
    useEffect,
    FC,
    ComponentType,
    ReactElement,
    useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
    sanitizeListRestProps,
    useListContext,
    useVersion,
    Identifier,
    Record,
    RecordMap,
    SortPayload,
} from 'ra-core';
import { Table, TableProps } from '@material-ui/core';
import classnames from 'classnames';
import union from 'lodash/union';
import difference from 'lodash/difference';

import { DatagridHeader } from './DatagridHeader';
import DatagridLoading from './DatagridLoading';
import DatagridBody, { PureDatagridBody } from './DatagridBody';
import useDatagridStyles from './useDatagridStyles';
import { ClassesOverride } from '../../types';
import { RowClickFunction } from './DatagridRow';
import DatagridContextProvider from './DatagridContextProvider';

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
 *
 *
 * @example Usage outside of a <List> or a <ReferenceManyField>.
 *
 * const currentSort = { field: 'published_at', order: 'DESC' };
 *
 * export const MyCustomList = (props) => {
 *     const { ids, data, total, loaded } = useGetList(
 *         'posts',
 *         { page: 1, perPage: 10 },
 *         currentSort
 *     );
 *
 *     return (
 *         <Datagrid
 *             basePath=""
 *             currentSort={currentSort}
 *             data={data}
 *             ids={ids}
 *             selectedIds={[]}
 *             loaded={loaded}
 *             total={total}
 *             setSort={() => {
 *                 console.log('set sort');
 *             }}
 *             onSelect={() => {
 *                 console.log('on select');
 *             }}
 *             onToggleItem={() => {
 *                 console.log('on toggle item');
 *             }}
 *         >
 *             <TextField source="id" />
 *             <TextField source="title" />
 *         </Datagrid>
 *     );
 * }
 */
const Datagrid: FC<DatagridProps> = React.forwardRef((props, ref) => {
    const classes = useDatagridStyles(props);
    const {
        optimized = false,
        body = optimized ? PureDatagridBody : DatagridBody,
        header = DatagridHeader,
        children,
        classes: classesOverride,
        className,
        empty,
        expand,
        // @ts-ignore
        fullWidth,
        hasBulkActions = false,
        hover,
        isRowSelectable,
        isRowExpandable,
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

    const contextValue = useMemo(() => ({ isRowExpandable }), [
        isRowExpandable,
    ]);

    const lastSelected = useRef(null);

    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleToggleItem = useCallback(
        (id, event) => {
            const lastSelectedIndex = ids.indexOf(lastSelected.current);
            lastSelected.current = event.target.checked ? id : null;

            if (event.shiftKey && lastSelectedIndex !== -1) {
                const index = ids.indexOf(id);
                const idsBetweenSelections = ids.slice(
                    Math.min(lastSelectedIndex, index),
                    Math.max(lastSelectedIndex, index) + 1
                );

                const newSelectedIds = event.target.checked
                    ? union(selectedIds, idsBetweenSelections)
                    : difference(selectedIds, idsBetweenSelections);

                onSelect(
                    isRowSelectable
                        ? newSelectedIds.filter((id: Identifier) =>
                              isRowSelectable(data[id])
                          )
                        : newSelectedIds
                );
            } else {
                onToggleItem(id);
            }
        },
        [data, ids, isRowSelectable, onSelect, onToggleItem, selectedIds]
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
     * the datagrid displays nothing or a custom empty component.
     */
    if (loaded && (ids.length === 0 || total === 0)) {
        if (empty) {
            return empty;
        }

        return null;
    }

    /**
     * After the initial load, if the data for the list isn't empty,
     * and even if the data is refreshing (e.g. after a filter change),
     * the datagrid displays the current data.
     */
    return (
        <DatagridContextProvider value={contextValue}>
            <Table
                ref={ref}
                className={classnames(classes.table, className)}
                size={size}
                {...sanitizeListRestProps(rest)}
            >
                {createOrCloneElement(
                    header,
                    {
                        children,
                        classes,
                        className,
                        currentSort,
                        data,
                        hasExpand: !!expand,
                        hasBulkActions,
                        ids,
                        isRowSelectable,
                        onSelect,
                        resource,
                        selectedIds,
                        setSort,
                    },
                    children
                )}
                {createOrCloneElement(
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
                        onToggleItem: handleToggleItem,
                        resource,
                        rowStyle,
                        selectedIds,
                        isRowSelectable,
                        version,
                    },
                    children
                )}
            </Table>
        </DatagridContextProvider>
    );
});

const createOrCloneElement = (element, props, children) =>
    isValidElement(element)
        ? cloneElement(element, props, children)
        : createElement(element, props, children);

Datagrid.propTypes = {
    basePath: PropTypes.string,
    // @ts-ignore
    body: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    children: PropTypes.node.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    currentSort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.any,
    empty: PropTypes.element,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool,
    // @ts-ignore
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
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
    isRowExpandable: PropTypes.func,
};

export interface DatagridProps<RecordType extends Record = Record>
    extends Omit<TableProps, 'size' | 'classes' | 'onSelect'> {
    body?: ReactElement | ComponentType;
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
    header?: ReactElement | ComponentType;
    hover?: boolean;
    empty?: ReactElement;
    isRowSelectable?: (record: Record) => boolean;
    isRowExpandable?: (record: Record) => boolean;
    optimized?: boolean;
    rowClick?: string | RowClickFunction;
    rowStyle?: (record: Record, index: number) => any;
    size?: 'medium' | 'small';
    // can be injected when using the component without context
    basePath?: string;
    currentSort?: SortPayload;
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    loaded?: boolean;
    onSelect?: (ids: Identifier[]) => void;
    onToggleItem?: (id: Identifier) => void;
    setSort?: (sort: string, order?: string) => void;
    selectedIds?: Identifier[];
    total?: number;
}

Datagrid.displayName = 'Datagrid';

export default Datagrid;
