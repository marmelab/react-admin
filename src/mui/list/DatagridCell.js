import React from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash.defaultsdeep';
import { TableRowColumn } from 'material-ui/Table';

const DatagridCell = ({
    className,
    field,
    record,
    basePath,
    resource,
    style,
    defaultStyle,
}) => {
    const computedStyle = defaultsDeep(
        {},
        style,
        field.props.style,
        field.type.defaultProps ? field.type.defaultProps.style : {},
        defaultStyle
    );
    return (
        <TableRowColumn className={className} style={computedStyle}>
            {React.cloneElement(field, {
                context: 'cell',
                record,
                basePath,
                resource,
            })}
        </TableRowColumn>
    );
};

DatagridCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
    style: PropTypes.object,
    defaultStyle: PropTypes.shape({
        td: PropTypes.object,
        'td:first-child': PropTypes.object,
    }),
};

export default DatagridCell;
