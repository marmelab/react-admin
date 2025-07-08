import { ReactElement } from 'react';
import { ExtractRecordPaths, HintedString } from '../../types';

type SortOrder = 'ASC' | 'DESC';

export interface FieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> {
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
     * Name of the property to display.
     *
     * @see https://marmelab.com/react-admin/Fields.html#source
     * @example
     * const CommentList = () => (
     *     <List>
     *         <Datagrid>
     *             <TextField source="author.name" />
     *             <TextField source="body" />
     *         </Datagrid>
     *     </List>
     * );
     */
    source: ExtractRecordPaths<RecordType>;

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
    label?: string | ReactElement | boolean;

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
     * The current record to use. Defaults to the `RecordContext` value.
     *
     * @see https://marmelab.com/react-admin/Fields.html#record
     */
    record?: RecordType;

    /**
     * The resource name. Defaults to the `ResourceContext` value.
     */
    resource?: string;
}
