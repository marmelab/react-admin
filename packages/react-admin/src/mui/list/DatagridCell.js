import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import classnames from 'classnames';

const DatagridCell = ({
    className,
    field,
    record,
    basePath,
    resource,
    ...rest
}) => (
    <TableCell
        className={classnames(className, field.props.className)}
        {...rest}
    >
        {React.cloneElement(field, { record, basePath, resource })}
    </TableCell>
);

DatagridCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
};

export default DatagridCell;
