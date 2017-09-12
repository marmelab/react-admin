import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import SelectionField from './SelectionField';
import DatagridCell from './DatagridCell';

const DatagridBody = ({
    resource,
    children,
    ids,
    data,
    basePath,
    styles,
    rowStyle,
    options,
    rowOptions,
    onSelectionChange,
    ...rest
}) => (
    <TableBody
        displayRowCheckbox={false}
        className="datagrid-body"
        {...rest}
        {...options}
    >
        {ids.map((id, rowIndex) => (
            <TableRow
                style={rowStyle ? rowStyle(data[id], rowIndex) : styles.tr}
                key={id}
                selectable={false}
                {...rowOptions}
            >
                <TableRowColumn style={styles.cell['td:first-child']}>
                    <SelectionField
                        id={id}
                        resource={resource}
                        onSelectionChange={onSelectionChange}
                    />
                </TableRowColumn>
                {React.Children.map(
                    children,
                    (field, index) =>
                        field ? (
                            <DatagridCell
                                key={`${id}-${field.props.source || index}`}
                                className={`column-${field.props.source}`}
                                record={data[id]}
                                defaultStyle={styles.cell.td}
                                {...{ field, basePath, resource }}
                            />
                        ) : null
                )}
            </TableRow>
        ))}
    </TableBody>
);

DatagridBody.propTypes = {
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    resource: PropTypes.string,
    data: PropTypes.object.isRequired,
    basePath: PropTypes.string,
    options: PropTypes.object,
    rowOptions: PropTypes.object,
    styles: PropTypes.object,
    rowStyle: PropTypes.func,
    onSelectionChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

DatagridBody.defaultProps = {
    data: {},
    ids: [],
};

const PureDatagridBody = shouldUpdate(
    (props, nextProps) => nextProps.isLoading === false
)(DatagridBody);

// trick material-ui Table into thinking this is one of the child type it supports
PureDatagridBody.muiName = 'TableBody';

export default PureDatagridBody;
