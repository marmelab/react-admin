import { ExtractRecordPaths } from '../../types';

export interface BaseFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> {
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
