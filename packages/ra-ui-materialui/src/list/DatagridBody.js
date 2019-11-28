import React, { cloneElement, memo } from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

import DatagridRow, { PureDatagridRow } from './DatagridRow';

const DatagridBody = ({
    basePath,
    children,
    classes,
    className,
    data,
    expand,
    hasBulkActions,
    hover,
    ids,
    onToggleItem,
    resource,
    row,
    rowClick,
    rowStyle,
    selectedIds,
    styles,
    version,
    isRowSelectable,
    ...rest
}) => (
    <TableBody className={classnames('datagrid-body', className)} {...rest}>
        {ids.map((id, rowIndex) =>
            cloneElement(
                row,
                {
                    basePath,
                    classes,
                    className: classnames(classes.row, {
                        [classes.rowEven]: rowIndex % 2 === 0,
                        [classes.rowOdd]: rowIndex % 2 !== 0,
                        [classes.clickableRow]: rowClick,
                    }),
                    expand,
                    hasBulkActions,
                    hover,
                    id,
                    key: id,
                    onToggleItem,
                    record: data[id],
                    resource,
                    rowClick,
                    selectable: !isRowSelectable || isRowSelectable(data[id]),
                    selected: selectedIds.includes(id),
                    style: rowStyle ? rowStyle(data[id], rowIndex) : null,
                },
                children
            )
        )}
    </TableBody>
);

DatagridBody.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    data: PropTypes.object.isRequired,
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    row: PropTypes.element,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    styles: PropTypes.object,
    isRowSelectable: PropTypes.func,
    version: PropTypes.number,
};

DatagridBody.defaultProps = {
    data: {},
    hasBulkActions: false,
    ids: [],
    row: <DatagridRow />,
};
// trick material-ui Table into thinking this is one of the child type it supports
DatagridBody.muiName = 'TableBody';

const areEqual = (prevProps, nextProps) => {
    const { children: _, ...prevPropsWithoutChildren } = prevProps;
    const { children: __, ...nextPropsWithoutChildren } = nextProps;
    return isEqual(prevPropsWithoutChildren, nextPropsWithoutChildren);
};

export const PureDatagridBody = memo(DatagridBody, areEqual);
// trick material-ui Table into thinking this is one of the child type it supports
PureDatagridBody.muiName = 'TableBody';
PureDatagridBody.defaultProps = {
    row: <PureDatagridRow />,
};

export default DatagridBody;
