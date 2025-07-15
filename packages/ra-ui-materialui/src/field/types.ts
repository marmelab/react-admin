import { TableCellProps } from '@mui/material/TableCell';
import { FieldPropsBase } from 'ra-core';

type TextAlign = TableCellProps['align'];

export interface FieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldPropsBase<RecordType> {
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
