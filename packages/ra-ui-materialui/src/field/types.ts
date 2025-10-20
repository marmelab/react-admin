import { ReactNode } from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { BaseFieldProps, ExtractRecordPaths, HintedString } from 'ra-core';

type TextAlign = TableCellProps['align'];
type SortOrder = 'ASC' | 'DESC';

export interface FieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends BaseFieldProps<RecordType> {
    /**
     * A class name to apply to the root div element
     */
    className?: string;

    /**
     * A class name to apply to the cell element when used inside <Datagrid>.
     */
    cellClassName?: string;

    /**
     * A class name to apply to the header cell element when used inside <Datagrid>.
     */
    headerClassName?: string;

    /**
     * Label to use as column header when using <Datagrid> or <SimpleShowLayout>.
     * Defaults to the capitalized field name. Set to false to disable the label.
     *
     * @see https://marmelab.com/react-admin/Fields.html#label
     * @example
     * const PostList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="title" />
     *             <TextField source="body" label="Content" />
     *         </Datagrid>
     *     </List>
     * );
     */
    label?: ReactNode;

    /**
     * Set it to false to disable the click handler on the column header when used inside <Datagrid>.
     *
     * @see https://marmelab.com/react-admin/Fields.html#sortable
     * @example
     * const PostList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="title" />
     *             <ReferenceField source="author_id" sortable={false}>
     *                 <TextField source="name" />
     *             </ReferenceField>
     *         </Datagrid>
     *     </List>
     * );
     */
    sortable?: boolean;

    /**
     * The text to display when the field value is empty. Defaults to empty string.
     *
     * @see https://marmelab.com/react-admin/Fields.html#emptytext
     * @example
     * const PostList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="title" />
     *             <TextField source="author" emptyText="missing data" />
     *         </Datagrid>
     *     </List>
     * );
     */
    emptyText?: string;

    /**
     * The field to use for sorting when users click this column head, if sortable.
     *
     * @see https://marmelab.com/react-admin/Fields.html#sortby
     * @example
     * const PostList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="title" />
     *             <ReferenceField source="author_id" sortBy="author.name">
     *                 <TextField source="name" />
     *             </ReferenceField>
     *         </Datagrid>
     *     </List>
     * );
     */
    sortBy?: HintedString<ExtractRecordPaths<RecordType>>;

    /**
     * The order used for sorting when users click this column head, if sortable.
     *
     * @see https://marmelab.com/react-admin/Fields.html#sortbyorder
     * @example
     * const PostList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="title" />
     *             <DateField source="updated_at" sortByOrder="DESC" />
     *         </Datagrid>
     *     </List>
     * );
     */
    sortByOrder?: SortOrder;

    /**
     * The text alignment for the cell content, when used inside <Datagrid>.
     *
     * @see https://marmelab.com/react-admin/Fields.html#textalign
     * @example
     * import { List, Datagrid, TextField } from 'react-admin';
     * const PostList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="id" />
     *             <TextField source="title" />
     *             <TextField source="author" />
     *             <TextField source="year" textAlign="right" />
     *         </Datagrid>
     *     </List>
     * );
     */
    textAlign?: TextAlign;

    /**
     * @deprecated
     */
    fullWidth?: boolean;
}
