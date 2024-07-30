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
import {
    sanitizeListRestProps,
    useListContextWithProps,
    Identifier,
    OptionalResourceContextProvider,
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
 *     const { data, total, isPending } = useGetList(
 *         'posts',
 *         { pagination: { page: 1, perPage: 10 }, sort: sort }
 *     );
 *
 *     return (
 *         <Datagrid
 *             data={data}
 *             total={total}
 *             isPending={isPending}
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
export const Datagrid: React.ForwardRefExoticComponent<
    Omit<DatagridProps, 'ref'> & React.RefAttributes<HTMLTableElement>
> = React.forwardRef<HTMLTableElement, DatagridProps>((props, ref) => {
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
        isPending,
        onSelect,
        onToggleItem,
        selectedIds,
        setSort,
        total,
    } = useListContextWithProps(props);

    const hasBulkActions = !!bulkActionButtons !== false;

    const contextValue = useMemo(
        () => ({ isRowExpandable, expandSingle }),
        [isRowExpandable, expandSingle]
    );

    const lastSelected = useRef(null);

    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps

    // we manage row selection at the datagrid level to allow shift+click to select an array of rows
    const handleToggleItem = useCallback(
        (id, event) => {
            if (!data) return;
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

                onSelect?.(
                    isRowSelectable
                        ? newSelectedIds.filter((id: Identifier) =>
                              isRowSelectable(
                                  data.find(record => record.id === id)
                              )
                          )
                        : newSelectedIds
                );
            } else {
                onToggleItem?.(id);
            }
        },
        [data, isRowSelectable, onSelect, onToggleItem, selectedIds]
    );

    if (isPending === true) {
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
            <OptionalResourceContextProvider value={resource}>
                <DatagridRoot
                    sx={sx}
                    className={clsx(DatagridClasses.root, className)}
                >
                    {bulkActionButtons !== false ? (
                        <BulkActionsToolbar>
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
            </OptionalResourceContextProvider>
        </DatagridContextProvider>
    );
});

const createOrCloneElement = (element, props, children) =>
    isValidElement(element)
        ? cloneElement(element, props, children)
        : createElement(element, props, children);

export interface DatagridProps<RecordType extends RaRecord = any>
    extends Omit<TableProps, 'size' | 'classes' | 'onSelect'> {
    /**
     * The component used to render the body of the table. Defaults to <DatagridBody>.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#body
     */
    body?: ReactElement | ComponentType;

    /**
     * A class name to apply to the root table element
     */
    className?: string;

    /**
     * The component used to render the bulk action buttons. Defaults to <BulkDeleteButton>.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#bulkactionbuttons
     * @example
     * import { List, Datagrid, BulkDeleteButton } from 'react-admin';
     * import { Button } from '@mui/material';
     * import ResetViewsButton from './ResetViewsButton';
     *
     * const PostBulkActionButtons = () => (
     *     <>
     *         <ResetViewsButton label="Reset Views" />
     *         <BulkDeleteButton />
     *     </>
     * );
     *
     * export const PostList = () => (
     *     <List>
     *         <Datagrid bulkActionButtons={<PostBulkActionButtons />}>
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    bulkActionButtons?: ReactElement | false;

    /**
     * The component used to render the expand panel for each row.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#expand
     * @example
     * import { List, Datagrid, useRecordContext } from 'react-admin';
     *
     * const PostPanel = () => {
     *     const record = useRecordContext();
     *     return (
     *         <div dangerouslySetInnerHTML={{ __html: record.body }} />
     *     );
     * };
     *
     * const PostList = () => (
     *     <List>
     *         <Datagrid expand={<PostPanel />}>
     *             ...
     *         </Datagrid>
     *     </List>
     * )
     */
    expand?:
        | ReactElement
        | FC<{
              id: Identifier;
              record: RecordType;
              resource: string;
          }>;

    /**
     * The component used to render the header row. Defaults to <DatagridHeader>.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#header
     */
    header?: ReactElement | ComponentType;

    /**
     * Whether to allow only one expanded row at a time. Defaults to false.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#expandsingle
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * export const PostList = () => (
     *    <List>
     *       <Datagrid expandSingle>
     *          ...
     *      </Datagrid>
     *   </List>
     * );
     */
    expandSingle?: boolean;

    /**
     * Set to false to disable the hover effect on rows.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#hover
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * const PostList = () => (
     *     <List>
     *         <Datagrid hover={false}>
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    hover?: boolean;

    /**
     * The component used to render the empty table.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#empty
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * const CustomEmpty = () => <div>No books found</div>;
     *
     * const PostList = () => (
     *     <List>
     *         <Datagrid empty={<CustomEmpty />}>
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    empty?: ReactElement;

    /**
     * A function that returns whether the row for a record is expandable.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#isrowexpandable
     * @example
     * import { List, Datagrid, useRecordContext } from 'react-admin';
     *
     * const PostPanel = () => {
     *     const record = useRecordContext();
     *     return (
     *         <div dangerouslySetInnerHTML={{ __html: record.body }} />
     *     );
     * };
     *
     * const PostList = () => (
     *     <List>
     *         <Datagrid
     *             expand={<PostPanel />}
     *             isRowExpandable={row => row.has_detail}
     *         >
     *             ...
     *         </Datagrid>
     *     </List>
     * )
     */
    isRowExpandable?: (record: RecordType) => boolean;

    /**
     * A function that returns whether the row for a record is selectable.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#isrowselectable
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <Datagrid isRowSelectable={ record => record.id > 300 }>
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    isRowSelectable?: (record: RecordType) => boolean;

    /**
     * Set to true to optimize datagrid rendering if the children never vary.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#optimized
     */
    optimized?: boolean;

    /**
     * The action to trigger when the user clicks on a row.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#rowclick
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <Datagrid rowClick="edit">
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    rowClick?: string | RowClickFunction | false;

    /**
     * A function that returns the sx prop to apply to a row.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#rowsx
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * const postRowSx = (record, index) => ({
     *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
     * });
     * export const PostList = () => (
     *     <List>
     *         <Datagrid rowSx={postRowSx}>
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    rowSx?: (record: RecordType, index: number) => SxProps;

    /**
     * @deprecated use rowSx instead
     */
    rowStyle?: (record: RecordType, index: number) => any;

    /**
     * Density setting, can be either 'small' or 'medium'. Defaults to 'small'.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#size
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <Datagrid size="medium">
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    size?: 'medium' | 'small';

    // can be injected when using the component without context
    sort?: SortPayload;
    data?: RecordType[];
    isLoading?: boolean;
    isPending?: boolean;
    onSelect?: (ids: Identifier[]) => void;
    onToggleItem?: (id: Identifier) => void;
    setSort?: (sort: SortPayload) => void;
    selectedIds?: Identifier[];
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
        .filter(
            propName => !injectedProps.includes(propName) || propName === 'ref'
        )
        .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});

Datagrid.displayName = 'Datagrid';

const DefaultEmpty = <ListNoResults />;
