import { ReactElement } from 'react';
import { Record } from 'ra-core';
import PropTypes from 'prop-types';

type TextAlign = 'right' | 'left';
type SortOrder = 'ASC' | 'DESC';
export interface FieldProps {
    addLabel?: boolean;
    sortBy?: string;
    sortByOrder?: SortOrder;
    source?: string;
    label?: string | ReactElement;
    sortable?: boolean;
    className?: string;
    cellClassName?: string;
    headerClassName?: string;
    textAlign?: TextAlign;
    emptyText?: string;
}

// Props injected by react-admin
export interface InjectedFieldProps {
    basePath?: string;
    record?: Record;
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
    textAlign: PropTypes.oneOf<TextAlign>(['right', 'left']),
    emptyText: PropTypes.string,
};
