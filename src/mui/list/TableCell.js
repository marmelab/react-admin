import React from 'react';
import { TableRowColumn } from 'material-ui/Table';

const TableCell = ({ field, record, basePath, resource, defaultStyle }) => {
    const style = field.props.tdStyle ? field.props.tdStyle : defaultStyle;
    return (
        <TableRowColumn style={style} >
            <field.type {...field.props} {...{ record, basePath, resource }} />
        </TableRowColumn>
    );
};

export default TableCell;
