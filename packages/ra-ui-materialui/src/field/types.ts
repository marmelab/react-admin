import { Record } from 'ra-core';
import PropTypes from 'prop-types';

type TextAlign = 'right' | 'left';
export interface FieldProps {
    addLabel?: boolean;
    sortBy?: string;
    source?: string;
    label?: string;
    sortable?: boolean;
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    textAlign?: TextAlign;
    emptyText?: string;
    fieldKey?: string;
}

// Props injected by react-admin
export interface InjectedFieldProps {
    basePath?: string;
    record?: Record;
}

export const fieldPropTypes = {
    addLabel: PropTypes.bool,
    sortBy: PropTypes.string,
    source: PropTypes.string,
    label: PropTypes.string,
    sortable: PropTypes.bool,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    textAlign: PropTypes.oneOf<TextAlign>(['right', 'left']),
    emptyText: PropTypes.string,
    fieldKey: PropTypes.string,
};
