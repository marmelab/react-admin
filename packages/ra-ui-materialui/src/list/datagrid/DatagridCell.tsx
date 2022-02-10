import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import clsx from 'clsx';
import { RaRecord } from 'ra-core';

const DatagridCell = React.forwardRef<HTMLTableCellElement, DatagridCellProps>(
    ({ className, field, record, resource, ...rest }, ref) => (
        <TableCell
            className={clsx(className, field.props.cellClassName)}
            align={field.props.textAlign}
            ref={ref}
            {...rest}
        >
            {field}
        </TableCell>
    )
);

DatagridCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    // @ts-ignore
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    resource: PropTypes.string,
};

export interface DatagridCellProps extends TableCellProps {
    className?: string;
    field?: JSX.Element;
    record?: RaRecord;
    resource?: string;
}

// What? TypeScript loses the displayName if we don't set it explicitly
DatagridCell.displayName = 'DatagridCell';

export default DatagridCell;
