import { ReactElement } from 'react';
import { Record } from 'ra-core';
import PropTypes from 'prop-types';
import { TableCellProps } from '@material-ui/core/TableCell';

type TextAlign = TableCellProps['align'];
type SortOrder = 'ASC' | 'DESC';

export interface FieldProps<RecordType extends Record = Record>
    extends PublicFieldProps,
        InjectedFieldProps<RecordType> {}

export interface PublicFieldProps {
    addLabel?: boolean;
    sortBy?: string;
    sortByOrder?: SortOrder;
    source?: string;
    label?: string | ReactElement;
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
export interface InjectedFieldProps<RecordType extends Record = Record> {
    basePath?: string;
    record?: RecordType;
    resource?: string;
}

export const fieldPropTypes = {
    addLabel: PropTypes.bool,
    sortBy: PropTypes.string,
    sortByOrder: PropTypes.oneOf<SortOrder>(['ASC', 'DESC']),
    source: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
