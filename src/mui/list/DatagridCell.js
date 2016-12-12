import React, { PropTypes } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import { TableRowColumn } from 'material-ui/Table';

const DatagridCell = ({ field, record, basePath, resource, defaultStyle }) => {
    const style = defaultsDeep({}, field.props.style, field.type.defaultProps ? field.type.defaultProps.style : {}, defaultStyle);
    return (
        <TableRowColumn style={style}>
            <field.type {...field.props} {...{ record, basePath, resource }} />
        </TableRowColumn>
    );
};

DatagridCell.propTypes = {
    field: PropTypes.element,
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
    defaultStyle: PropTypes.shape({
        td: PropTypes.object,
        'td:first-child': PropTypes.object,
    }),
};

export default DatagridCell;
