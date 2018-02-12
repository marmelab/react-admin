import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableBody } from 'material-ui/Table';
import classnames from 'classnames';

import DatagridRow from './DatagridRow';

const DatagridBody = ({
    basePath,
    classes,
    className,
    resource,
    children,
    ids,
    isLoading,
    data,
    selectedIds,
    styles,
    rowStyle,
    onToggleItem,
    ...rest
}) => (
    <TableBody className={classnames('datagrid-body', className)} {...rest}>
        {ids.map((id, rowIndex) => (
            <DatagridRow
                className={classnames(classes.row, {
                    [classes.rowEven]: rowIndex % 2 === 0,
                    [classes.rowOdd]: rowIndex % 2 !== 0,
                })}
                basePath={basePath}
                classes={classes}
                key={id}
                record={data[id]}
                id={id}
                resource={resource}
                onToggleItem={onToggleItem}
                selected={selectedIds.includes(id)}
                style={rowStyle ? rowStyle(data[id], rowIndex) : null}
            >
                {children}
            </DatagridRow>
        ))}
    </TableBody>
);

DatagridBody.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    data: PropTypes.object.isRequired,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    onToggleItem: PropTypes.func.isRequired,
    resource: PropTypes.string,
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    styles: PropTypes.object,
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
