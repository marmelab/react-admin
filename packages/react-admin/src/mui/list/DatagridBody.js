import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableBody, TableRow } from 'material-ui/Table';
import classnames from 'classnames';

import DatagridCell from './DatagridCell';

const DatagridBody = ({
    classes,
    className,
    resource,
    children,
    ids,
    isLoading,
    data,
    basePath,
    styles,
    rowClassName,
    options,
    rowOptions,
    ...rest
}) => (
    <TableBody
        className={classnames('datagrid-body', className)}
        {...rest}
        {...options}
    >
        {ids.map((id, rowIndex) => (
            <TableRow
                className={classnames(
                    classes.row,
                    rowClassName
                        ? typeof rowClassName === 'function'
                          ? rowClassName(data[id], rowIndex)
                          : rowClassName
                        : undefined
                )}
                key={id}
                {...rowOptions}
            >
                {React.Children.map(
                    children,
                    (field, index) =>
                        field ? (
                            <DatagridCell
                                key={`${id}-${field.props.source || index}`}
                                className={classnames(
                                    `column-${field.props.source}`,
                                    {
                                        [classes.rowFirstCell]: index === 0,
                                        [classes.rowCell]: index > 0,
                                    }
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
    options: PropTypes.object,
    rowOptions: PropTypes.object,
    styles: PropTypes.object,
    rowClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
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
