import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = {
    cellRightAligned: { textAlign: 'right' },
};

const sanitizeRestProps = ({
    cellClassName,
    classes,
    className,
    field,
    formClassName,
    headerClassName,
    record,
    basePath,
    resource,
    ...rest
}) => rest;

export const DatagridCell = ({
    classes = {},
    className,
    field,
    record,
    basePath,
    resource,
    ...rest
}) => (
    <TableCell
        className={classnames(
            {
                [classes.cellRightAligned]: field.props.textAlign === 'right',
            },
            className,
            field.props.cellClassName
        )}
        {...sanitizeRestProps(rest)}
    >
        {React.cloneElement(field, {
            record,
            basePath: field.props.basePath || basePath,
            resource,
        })}
    </TableCell>
);

DatagridCell.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    field: PropTypes.element,
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
};

export default withStyles(styles)(DatagridCell);
