import React, { PropTypes } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import { TableRowColumn } from 'material-ui/Table';

const DatagridCell = ({ field, record, basePath, resource, defaultStyle, isFirst }) => {
    const styles = defaultsDeep({}, defaultStyle, field.props.cellStyle);
    return (
        <TableRowColumn style={isFirst ? { ...styles.td, ...styles['td:first-child'] } : styles.td}>
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
    isFirst: PropTypes.bool,
};

export default DatagridCell;
