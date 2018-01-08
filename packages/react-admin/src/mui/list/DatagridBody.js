import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableBody, TableRow } from 'material-ui/Table';
import classnames from 'classnames';

import DatagridCell from './DatagridCell';
import DatagridSelectCell from './DatagridSelectCell';

const DatagridBody = ({
    classes,
    className,
    resource,
    children,
    ids,
    isLoading,
    data,
    basePath,
    rowStyle,
    selectable,
    selection,
    selectionMode,
    ...rest
}) => (
    <TableBody className={classnames('datagrid-body', className)} {...rest}>
        {ids.map((id, rowIndex) => (
            <TableRow
                className={classnames(classes.row, {
                    [classes.rowEven]: rowIndex % 2 === 0,
                    [classes.rowOdd]: rowIndex % 2 !== 0,
                })}
                key={id}
                style={rowStyle ? rowStyle(data[id], rowIndex) : null}
            >
                {selectable && (
                    <DatagridSelectCell
                        key={`${id}-select`}
                        record={data[id]}
                        selection={selection}
                        selectionMode={selectionMode}
                        resource={resource}
                        className={classes.rowCell}
                    />
                )}
                {React.Children.map(
                    children,
                    (field, index) =>
                        field ? (
                            <DatagridCell
                                key={`${id}-${field.props.source || index}`}
                                className={classnames(
                                    `column-${field.props.source}`,
                                    classes.rowCell
                                )}
                                record={data[id]}
                                {...{ field, basePath, resource }}
                            />
                        ) : null
                )}
            </TableRow>
        ))}
    </TableBody>
);

DatagridBody.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    resource: PropTypes.string,
    data: PropTypes.object.isRequired,
    basePath: PropTypes.string,
    rowStyle: PropTypes.func,
    styles: PropTypes.object,
    selectable: PropTypes.bool,
    selection: PropTypes.array,
    selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']),
};

DatagridBody.defaultProps = {
    data: {},
    ids: [],
    selectionMode: 'bulk',
};

const PureDatagridBody = shouldUpdate(
    (props, nextProps) => nextProps.isLoading === false
)(DatagridBody);

// trick material-ui Table into thinking this is one of the child type it supports
PureDatagridBody.muiName = 'TableBody';

export default PureDatagridBody;
