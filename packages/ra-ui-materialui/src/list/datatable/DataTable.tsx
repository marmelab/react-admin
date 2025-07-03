import * as React from 'react';
import {
    isValidElement,
    type FC,
    type ComponentType,
    type ReactNode,
} from 'react';
import {
    DataTableBase,
    DataTableRenderContext,
    useCanAccess,
    useListContextWithProps,
    useResourceContext,
    useStore,
    type Identifier,
    type RaRecord,
    type SortPayload,
    type ListControllerResult,
} from 'ra-core';
import {
    Table,
    useThemeProps,
    type TableProps,
    type SxProps,
} from '@mui/material';
import clsx from 'clsx';

import { type RowClickFunction } from '../types';
import { BulkActionsToolbar } from '../BulkActionsToolbar';
import { BulkDeleteButton } from '../../button';
import { ListNoResults } from '../ListNoResults';

import { DataTableClasses, DataTableRoot } from './DataTableRoot';
import { DataTableLoading } from './DataTableLoading';
import { DataTableBody } from './DataTableBody';
import { DataTableHead } from './DataTableHead';
import { DataTableColumn } from './DataTableColumn';
import { DataTableNumberColumn } from './DataTableNumberColumn';
import { ColumnsSelector } from './ColumnsSelector';
import { DataTableRowSxContext } from './DataTableRowSxContext';

const DefaultFoot = (_props: { children: ReactNode }) => null;
const PREFIX = 'RaDataTable';

/**
 * The DataTable component renders a list of records as a table.
 * It is usually used as a child of the <List> and <ReferenceManyField> components.
 *
 * Props:
 *  - body
 *  - bulkActionToolbar
 *  - bulkActionButtons
 *  - children
 *  - empty
 *  - expand
 *  - footer
 *  - header
 *  - hover
 *  - isRowExpandable
 *  - isRowSelectable
 *  - rowClick
 *  - rowSx
 *  - size
 *  - sx
 *
 * @example // Display all posts as a data table
 * const postRowSx = (record, index) => ({
 *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = () => (
 *     <List>
 *         <DataTable rowSx={postRowSx}>
 *             <DataTable.Col source="id" />
 *             <DataTable.Col source="title" />
 *             <DataTable.Col source="body" />
 *             <DataTable.Col>
 *                 <EditButton />
 *             </DataTable.Col>
 *         </DataTable>
 *     </List>
 * );
 *
 * @example // Display all the comments of the current post as a data table
 * <ReferenceManyField reference="comments" target="post_id">
 *     <DataTable>
 *         <DataTable.Col source="id" />
 *         <DataTable.Col source="body" />
 *         <DataTable.Col source="created_at" />
 *         <DataTable.Col>
 *             <EditButton />
 *         </DataTable.Col>
 *     </DataTable>
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
 *         <DataTable
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
 *             <DataTable.Col source="id" />
 *             <DataTable.Col source="title" />
 *         </DataTable>
 *     );
 * }
 */
export const DataTable = React.forwardRef(function DataTable<
    RecordType extends RaRecord = any,
>(
    inProps: DataTableProps<RecordType>,
    ref: React.ForwardedRef<HTMLTableElement>
) {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const resourceFromContext = useResourceContext(props);
    const { canAccess: canDelete } = useCanAccess({
        resource: resourceFromContext,
        action: 'delete',
    });

    const {
        body: TableBody = DataTableBody,
        head: TableHead = DataTableHead,
        foot: TableFoot = DefaultFoot,
        children,
        className,
        empty,
        expand,
        bulkActionsToolbar,
        bulkActionButtons = canDelete ? defaultBulkActionButtons : false,
        rowSx,
        size = 'small',
        sx,
        ...rest
    } = props;

    const { onToggleItem } = useListContextWithProps(props);

    const hasBulkActions = !!bulkActionButtons !== false;

    const storeKey = props.storeKey || `${resourceFromContext}.datatable`;
    const [columnRanks] = useStore<number[]>(`${storeKey}_columnRanks`);
    const columns = columnRanks
        ? reorderChildren(children, columnRanks)
        : children;

    const loading = (
        <DataTableLoading
            className={className}
            expand={expand}
            hasBulkActions={hasBulkActions}
            nbChildren={React.Children.count(children)}
            size={size}
        />
    );

    return (
        <DataTableBase<RecordType>
            {...props}
            hasBulkActions={hasBulkActions}
            loading={loading}
            empty={
                empty === undefined ? (
                    <ListNoResults resource={resourceFromContext} />
                ) : (
                    empty
                )
            }
        >
            <DataTableRowSxContext.Provider value={rowSx}>
                <DataTableRoot
                    sx={sx}
                    className={clsx(DataTableClasses.root, className)}
                >
                    {/* the test on onToggleItem prevents error when Datable is used in standalone mode */}
                    {onToggleItem &&
                        (bulkActionsToolbar ??
                            (bulkActionButtons !== false && (
                                <BulkActionsToolbar>
                                    {isValidElement(bulkActionButtons)
                                        ? bulkActionButtons
                                        : defaultBulkActionButtons}
                                </BulkActionsToolbar>
                            )))}
                    <div className={DataTableClasses.tableWrapper}>
                        <Table
                            ref={ref}
                            className={DataTableClasses.table}
                            size={size}
                            {...sanitizeRestProps(rest)}
                        >
                            <DataTableRenderContext.Provider value="header">
                                <TableHead>{columns}</TableHead>
                            </DataTableRenderContext.Provider>
                            <TableBody>{columns}</TableBody>
                            <DataTableRenderContext.Provider value="footer">
                                <TableFoot>{columns}</TableFoot>
                            </DataTableRenderContext.Provider>
                        </Table>
                    </div>
                </DataTableRoot>
            </DataTableRowSxContext.Provider>
            <DataTableRenderContext.Provider value="columnsSelector">
                <ColumnsSelector>{children}</ColumnsSelector>
            </DataTableRenderContext.Provider>
        </DataTableBase>
    );
}) as unknown as (<RecordType extends RaRecord = any>(
    props: DataTableProps<RecordType> & {
        ref?: React.ForwardedRef<HTMLTableElement>;
    }
) => JSX.Element) & {
    Col: typeof DataTableColumn;
    NumberCol: typeof DataTableNumberColumn;
    displayName: string;
};

DataTable.Col = DataTableColumn;
DataTable.NumberCol = DataTableNumberColumn;
DataTable.displayName = 'DataTable';

const defaultBulkActionButtons = <BulkDeleteButton />;

/**
 * Reorder children based on columnRanks
 *
 * Note that columnRanks may be shorter than the number of children
 */
const reorderChildren = (children: ReactNode, columnRanks: number[]) =>
    React.Children.toArray(children).reduce((acc, child, index) => {
        const rank = columnRanks.indexOf(index);
        if (rank === -1) {
            // if the column is not in columnRanks, keep it at the same index
            acc[index] = child;
        } else {
            // if the column is in columnRanks, move it to the rank index
            acc[rank] = child;
        }
        return acc;
    }, []);

export interface DataTableProps<RecordType extends RaRecord = any>
    extends Omit<TableProps, 'size' | 'classes' | 'onSelect'> {
    /**
     * The component used to render the body of the table. Defaults to <DataTableBody>.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#body
     */
    body?: ComponentType;

    /**
     * A class name to apply to the root table element
     */
    className?: string;

    /**
     * The component used to render the bulk actions toolbar.
     *
     * @example
     * import { List, DataTable, BulkActionsToolbar, SelectAllButton, BulkDeleteButton } from 'react-admin';
     *
     * const PostBulkActionsToolbar = () => (
     *     <BulkActionsToolbar selectAllButton={<SelectAllButton label="Select all records" />}>
     *         <BulkDeleteButton />
     *     </BulkActionsToolbar>
     * );
     *
     * export const PostList = () => (
     *     <List>
     *         <DataTable bulkActionsToolbar={<PostBulkActionsToolbar />}>
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    bulkActionsToolbar?: ReactNode;

    /**
     * The component used to render the bulk action buttons. Defaults to <BulkDeleteButton>.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#bulkactionbuttons
     * @example
     * import { List, DataTable, BulkDeleteButton } from 'react-admin';
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
     *         <DataTable bulkActionButtons={<PostBulkActionButtons />}>
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    bulkActionButtons?: ReactNode;

    /**
     * The component used to render the expand panel for each row.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#expand
     * @example
     * import { List, DataTable, useRecordContext } from 'react-admin';
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
     *         <DataTable expand={<PostPanel />}>
     *             ...
     *         </DataTable>
     *     </List>
     * )
     */
    expand?:
        | ReactNode
        | FC<{
              id: Identifier;
              record: RecordType;
              resource: string;
          }>;

    /**
     * Whether to allow only one expanded row at a time. Defaults to false.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#expandsingle
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * export const PostList = () => (
     *    <List>
     *       <DataTable expandSingle>
     *          ...
     *      </DataTable>
     *   </List>
     * );
     */
    expandSingle?: boolean;

    /**
     * The component used to render the footer row. Defaults en empty component.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#footer
     */
    foot?: ComponentType;

    /**
     * The component used to render the header row. Defaults to <DataTableHead>.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#header
     */
    head?: ComponentType;

    /**
     * A list of columns that should be hidden by default.
     *
     * Use the ColumnsButton to allow users to show/hide columns.
     */
    hiddenColumns?: string[];

    /**
     * Set to false to disable the hover effect on rows.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#hover
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * const PostList = () => (
     *     <List>
     *         <DataTable hover={false}>
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    hover?: boolean;

    /**
     * The component used to render the empty table.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#empty
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * const CustomEmpty = () => <div>No books found</div>;
     *
     * const PostList = () => (
     *     <List>
     *         <DataTable empty={<CustomEmpty />}>
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    empty?: ReactNode;

    /**
     * A function that returns whether the row for a record is expandable.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#isrowexpandable
     * @example
     * import { List, DataTable, useRecordContext } from 'react-admin';
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
     *         <DataTable
     *             expand={<PostPanel />}
     *             isRowExpandable={row => row.has_detail}
     *         >
     *             ...
     *         </DataTable>
     *     </List>
     * )
     */
    isRowExpandable?: (record: RecordType) => boolean;

    /**
     * A function that returns whether the row for a record is selectable.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#isrowselectable
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <DataTable isRowSelectable={ record => record.id > 300 }>
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    isRowSelectable?: (record: RecordType) => boolean;

    /**
     * The action to trigger when the user clicks on a row.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#rowclick
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <DataTable rowClick="edit">
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    rowClick?: string | RowClickFunction<RecordType> | false;

    /**
     * A function that returns the sx prop to apply to a row.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#rowsx
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * const postRowSx = (record, index) => ({
     *     backgroundColor: record.nb_views >= 500 ? '#efe' : 'white',
     * });
     * export const PostList = () => (
     *     <List>
     *         <DataTable rowSx={postRowSx}>
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    rowSx?: (record: RecordType, index: number) => SxProps;

    /**
     * Density setting, can be either 'small' or 'medium'. Defaults to 'small'.
     *
     * @see https://marmelab.com/react-admin/DataTable.html#size
     * @example
     * import { List, DataTable } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <DataTable size="medium">
     *             ...
     *         </DataTable>
     *     </List>
     * );
     */
    size?: 'medium' | 'small';

    /**
     * The key used to store the hidden columns is the storeKey prop.
     *
     * It is derived from the resource prop if missing.
     */
    storeKey?: string;

    // can be injected when using the component without context
    sort?: SortPayload;
    data?: RecordType[];
    isLoading?: boolean;
    isPending?: boolean;
    onSelect?: ListControllerResult['onSelect'];
    onSelectAll?: ListControllerResult['onSelectAll'];
    onToggleItem?: ListControllerResult['onToggleItem'];
    onUnselectItems?: ListControllerResult['onUnselectItems'];
    setSort?: ListControllerResult['setSort'];
    selectedIds?: Identifier[];
    total?: number;
}

const sanitizeRestProps = ({
    sort,
    data,
    expandSingle,
    hiddenColumns,
    hover,
    isLoading,
    isPending,
    isRowExpandable,
    isRowSelectable,
    onSelect,
    onToggleItem,
    resource,
    rowClick,
    setSort,
    selectedIds,
    storeKey,
    total,
    ...rest
}: Pick<
    DataTableProps,
    | 'sort'
    | 'data'
    | 'expandSingle'
    | 'hiddenColumns'
    | 'hover'
    | 'isLoading'
    | 'isPending'
    | 'isRowExpandable'
    | 'isRowSelectable'
    | 'onSelect'
    | 'onToggleItem'
    | 'resource'
    | 'rowClick'
    | 'setSort'
    | 'selectedIds'
    | 'storeKey'
    | 'total'
>) => rest;
