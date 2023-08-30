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
    Identifier,
    RaRecord,
    SortPayload,
} from 'ra-core';
import { Table, TableProps, SxProps } from '@mui/material';
import clsx from 'clsx';
import union from 'lodash/union';
import difference from 'lodash/difference';

import { DatagridHeader } from './DatagridHeader';
import DatagridLoading from './DatagridLoading';
import DatagridBody, { PureDatagridBody } from './DatagridBody';
import { RowClickFunction } from './DatagridRow';
import DatagridContextProvider from './DatagridContextProvider';
import { DatagridClasses, DatagridRoot } from './useDatagridStyles';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { BulkDeleteButton } from '../../button';
import { ListNoResults } from '../ListNoResults';

const defaultBulkActionButtons = <BulkDeleteButton />;

/**
 * The Datagrid component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - body
 *  - bulkActionButtons
 *  - children
 *  - empty
 *  - expand
 *  - header
 *  - hover
 *  - isRowExpandable
 *  - isRowSelectable
 *  - optimized
 *  - rowClick
 *  - rowSx
 *  - size
 *  - sx
 *
 * @example // Display all posts as a datagrid
 * const postRowSx = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = () => (
 *     <List>
 *         <Datagrid rowSx={postRowSx}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="body" />
 *             <EditButton />
 *         </Datagrid>
 *     </List>
 * );
 *
 * @example // Display all the comments of the current post as a datagrid
 * <ReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceManyField>
 *
 * @example // Usage outside of a <List> or a <ReferenceManyField>.
 *
 * const sort = { field: 'published_at', order: 'DESC' };
 *
 * export const MyCustomList = (props) => {
 *     const { data, total, isLoading } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: sort }
 *     );
 *
 *     return (
 *         <Datagrid
 *             data={data}
 *             total={total}
 *             isLoading={isLoading}
 *             sort={sort}
 *             selectedIds={[]}
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
export const Datagrid: FC<DatagridProps> = React.forwardRef((props, ref) => {
    const {
        optimized = false,
        body = optimized ? PureDatagridBody : DatagridBody,
        header = DatagridHeader,
        children,
        className,
        empty = DefaultEmpty,
        expand,
        bulkActionButtons = defaultBulkActionButtons,
        hover,
        isRowSelectable,
        isRowExpandable,
        resource,
        rowClick,
        rowSx,
        rowStyle,
        size = 'small',
        sx,
        expandSingle = false,
        ...rest
    } = props;

    const {
        sort,
        data,
        isLoading,
        onSelect,
        onToggleItem,
        selectedIds,
        setSort,
        total,
    } = useListContext(props);

    const hasBulkActions = !!bulkActionButtons !== false;

    const contextValue = useMemo(() => ({ isRowExpandable, expandSingle }), [
        isRowExpandable,
        expandSingle,
    ]);

    const lastSelected = useRef(null);

    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps

    // we manage row selection at the datagrid level to allow shift+click to select an array of rows
    const handleToggleItem = useCallback(
        (id, event) => {
            const ids = data.map(record => record.id);
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
                              isRowSelectable(
                                  data.find(record => record.id === id)
                              )
                          )
                        : newSelectedIds
                );
            } else {
                onToggleItem(id);
            }
        },
        [data, isRowSelectable, onSelect, onToggleItem, selectedIds]
    );

    if (isLoading === true) {
        return (
            <DatagridLoading
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
     * the Datagrid displays the empty component.
     */
    if (data == null || data.length === 0 || total === 0) {
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
            <DatagridRoot
                sx={sx}
                className={clsx(DatagridClasses.root, className)}
            >
                {bulkActionButtons !== false ? (
                    <BulkActionsToolbar selectedIds={selectedIds}>
                        {isValidElement(bulkActionButtons)
                            ? bulkActionButtons
                            : defaultBulkActionButtons}
                    </BulkActionsToolbar>
                ) : null}
                <div className={DatagridClasses.tableWrapper}>
                    <Table
                        ref={ref}
                        className={DatagridClasses.table}
                        size={size}
                        {...sanitizeRestProps(rest)}
                    >
                        {createOrCloneElement(
                            header,
                            {
                                children,
                                sort,
                                data,
                                hasExpand: !!expand,
                                hasBulkActions,
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
                                expand,
                                rowClick,
                                data,
                                hasBulkActions,
                                hover,
                                onToggleItem: handleToggleItem,
                                resource,
                                rowSx,
                                rowStyle,
                                selectedIds,
                                isRowSelectable,
                            },
                            children
                        )}
                    </Table>
                </div>
            </DatagridRoot>
        </DatagridContextProvider>
    );
});

const createOrCloneElement = (element, props, children) =>
    isValidElement(element)
        ? cloneElement(element, props, children)
        : createElement(element, props, children);

Datagrid.propTypes = {
    // @ts-ignore
    body: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    // @ts-ignore-line
    bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.arrayOf(PropTypes.any),
    empty: PropTypes.element,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    // @ts-ignore
    header: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hover: PropTypes.bool,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    // @ts-ignore
    rowClick: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.bool,
    ]),
    rowSx: PropTypes.func,
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    setSort: PropTypes.func,
    total: PropTypes.number,
    isRowSelectable: PropTypes.func,
    isRowExpandable: PropTypes.func,
    expandSingle: PropTypes.bool,
};

export interface DatagridProps<RecordType extends RaRecord = any>
    extends Omit<TableProps, 'size' | 'classes' | 'onSelect'> {
    body?: ReactElement | ComponentType;
    className?: string;
    bulkActionButtons?: ReactElement | false;
    expand?:
        | ReactElement
        | FC<{
              id: Identifier;
              record: RecordType;
              resource: string;
          }>;
    header?: ReactElement | ComponentType;
    hover?: boolean;
    empty?: ReactElement;
    isRowSelectable?: (record: RecordType) => boolean;
    isRowExpandable?: (record: RecordType) => boolean;
    optimized?: boolean;
    rowClick?: string | RowClickFunction | false;
    rowSx?: (record: RecordType, index: number) => SxProps;
    /**
     * @deprecated use rowStyle instead
     */
    rowStyle?: (record: RecordType, index: number) => any;
    size?: 'medium' | 'small';
    // can be injected when using the component without context
    sort?: SortPayload;
    data?: RecordType[];
    isLoading?: boolean;
    onSelect?: (ids: Identifier[]) => void;
    onToggleItem?: (id: Identifier) => void;
    setSort?: (sort: SortPayload) => void;
    selectedIds?: Identifier[];
    expandSingle?: boolean;
    total?: number;
}

const injectedProps = [
    'isRequired',
    'setFilter',
    'setPagination',
    'limitChoicesToValue',
    'translateChoice',
    // Datagrid may be used as an alternative to SelectInput
    'field',
    'fieldState',
    'formState',
];

const sanitizeRestProps = props =>
    Object.keys(sanitizeListRestProps(props))
        .filter(propName => !injectedProps.includes(propName))
        .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

Datagrid.displayName = 'Datagrid';

const DefaultEmpty = <ListNoResults />;
