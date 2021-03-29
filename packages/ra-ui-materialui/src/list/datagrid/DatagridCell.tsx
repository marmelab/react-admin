import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import classnames from 'classnames';
import { Record } from 'ra-core';

const DatagridCell = React.forwardRef<HTMLTableCellElement, DatagridCellProps>(
    ({ className, field, record, basePath, resource, ...rest }, ref) => (
        <TableCell
            className={classnames(className, field.props.cellClassName)}
            align={field.props.textAlign}
            ref={ref}
            {...rest}
        >
            {React.cloneElement(field, {
                record,
                basePath: field.props.basePath || basePath,
                resource,
            })}
        </TableCell>
    )
);

DatagridCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    // @ts-ignore
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
};

export interface DatagridCellProps extends TableCellProps {
    basePath?: string;
    className?: string;
    field?: JSX.Element;
    record?: Record;
    resource?: string;
}

// What? TypeScript loses the displayName if we don't set it explicitly
DatagridCell.displayName = 'DatagridCell';

export default DatagridCell;
