import { ReactElement } from 'react';
import { RaRecord } from 'ra-core';
import PropTypes from 'prop-types';
import { TableCellProps } from '@mui/material/TableCell';

type TextAlign = TableCellProps['align'];
type SortOrder = 'ASC' | 'DESC';

export interface FieldProps<RaRecordType extends RaRecord = any>
    extends PublicFieldProps,
        InjectedFieldProps<RaRecordType> {}

export interface PublicFieldProps {
    addLabel?: boolean;
    sortBy?: string;
    sortByOrder?: SortOrder;
    source?: string;
    label?: string | ReactElement | boolean;
    sortable?: boolean;
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    formClassName?: string;
    textAlign?: TextAlign;
    emptyText?: string;
    fullWidth?: boolean;
}

// Props injected by react-admin
export interface InjectedFieldProps<RaRecordType extends RaRecord = any> {
    basePath?: string;
    record?: RaRecordType;
    resource?: string;
}

export const fieldPropTypes = {
    addLabel: PropTypes.bool,
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
