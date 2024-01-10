import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { TableCellProps } from '@mui/material/TableCell';
import { Call, Objects } from 'hotscript';

type TextAlign = TableCellProps['align'];
type SortOrder = 'ASC' | 'DESC';
type AnyString = string & {};

export interface FieldProps<
    RecordType extends Record<string, any> = Record<string, any>
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
    sortBy?: Call<Objects.AllPaths, RecordType> | AnyString;

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
    source?: Call<Objects.AllPaths, RecordType> extends never
        ? AnyString
        : Call<Objects.AllPaths, RecordType>;

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

    /*
     * @deprecated this property is not used anymore
     */
    formClassName?: string;

    /**
     * The text alignment for the cell content, when used inside <Datagrid>.
     *
     * @see https://marmelab.com/react-admin/Fields.html#textalign
     * @example
     * const BasketTotal = () => {
     *     const record = useRecordContext();
     *     if (!record) return null;
     *     const total = record.items.reduce((total, item) => total + item.price, 0);
     *     return <span>{total}</span>;
     * }
     * BasketTotal.defaultProps = {
     *     textAlign: 'right',
     * };
     */
    textAlign?: TextAlign;

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
     * @deprecated
     */
    fullWidth?: boolean;

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

/**
 * @deprecated use FieldProps instead
 */
export interface PublicFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
    SortByType = unknown
> {
    sortBy?: unknown extends SortByType
        ? Call<Objects.AllPaths, RecordType>
        : SortByType;
    sortByOrder?: SortOrder;
    source?: Call<Objects.AllPaths, RecordType>;
    label?: string | ReactElement | boolean;
    sortable?: boolean;
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    /*
     * @deprecated this property is not used anymore
     */
    formClassName?: string;
    textAlign?: TextAlign;
    emptyText?: string;
    fullWidth?: boolean;
    record?: RecordType;
    resource?: string;
}

/**
 * @deprecated use FieldProps instead
 */
export interface InjectedFieldProps<RecordType = any> {
    record?: RecordType;
    resource?: string;
}

export const fieldPropTypes = {
    sortBy: PropTypes.string,
    sortByOrder: PropTypes.oneOf<SortOrder>(['ASC', 'DESC']),
    source: PropTypes.string,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.bool,
    ]),
    sortable: PropTypes.bool,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    textAlign: PropTypes.oneOf<TextAlign>([
        'inherit',
        'left',
        'center',
        'right',
        'justify',
    ]),
    emptyText: PropTypes.string,
};
