import { ReactElement } from 'react';
import { RaRecord } from 'ra-core';
import PropTypes from 'prop-types';
import { TableCellProps } from '@mui/material/TableCell';
import { Call, Objects } from 'hotscript';

type TextAlign = TableCellProps['align'];
type SortOrder = 'ASC' | 'DESC';

export interface FieldProps<RecordType extends RaRecord = any>
    extends PublicFieldProps,
        InjectedFieldProps<RecordType> {}

export interface PublicFieldProps<
    RecordType extends Record<string, unknown> = Record<string, any>,
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
}

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
