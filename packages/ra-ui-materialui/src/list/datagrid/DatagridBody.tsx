import * as React from 'react';
import { cloneElement, memo, FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { TableBody, TableBodyProps } from '@material-ui/core';
import classnames from 'classnames';
import { shallowEqual } from 'react-redux';
import { Identifier, Record, RecordMap } from 'ra-core';

import DatagridRow, { PureDatagridRow, RowClickFunction } from './DatagridRow';
import useDatagridStyles from './useDatagridStyles';

const DatagridBody: FC<DatagridBodyProps> = React.forwardRef(
    (
        {
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
            isRowSelectable,
            ...rest
        },
        ref
    ) => (
        <TableBody
            ref={ref}
            className={classnames('datagrid-body', className)}
            {...rest}
        >
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
                        hasBulkActions: hasBulkActions && !!selectedIds,
                        hover,
                        id,
                        key: id,
                        onToggleItem,
                        record: data[id],
                        resource,
                        rowClick,
                        selectable:
                            !isRowSelectable || isRowSelectable(data[id]),
                        selected: selectedIds?.includes(id),
                        style: rowStyle ? rowStyle(data[id], rowIndex) : null,
                    },
                    children
                )
            )}
        </TableBody>
    )
);

DatagridBody.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.any,
    className: PropTypes.string,
    children: PropTypes.node,
    // @ts-ignore
    data: PropTypes.object.isRequired,
    // @ts-ignore
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
};

DatagridBody.defaultProps = {
    data: {},
    hasBulkActions: false,
    ids: [],
    row: <DatagridRow />,
};

export interface DatagridBodyProps extends Omit<TableBodyProps, 'classes'> {
    basePath?: string;
    classes?: ReturnType<typeof useDatagridStyles>;
    className?: string;
    data?: RecordMap;
    expand?:
        | ReactElement
        | FC<{
              basePath: string;
              id: Identifier;
              record: Record;
              resource: string;
          }>;
    hasBulkActions?: boolean;
    hover?: boolean;
    ids?: Identifier[];
    onToggleItem?: (
        id: Identifier,
        event: React.TouchEvent | React.MouseEvent
    ) => void;
    record?: Record;
    resource?: string;
    row?: ReactElement;
    rowClick?: string | RowClickFunction;
    rowStyle?: (record: Record, index: number) => any;
    selectedIds?: Identifier[];
    isRowSelectable?: (record: Record) => boolean;
}

// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
DatagridBody.muiName = 'TableBody';

const areEqual = (prevProps, nextProps) => {
    const {
        children: _1,
        expand: _2,
        row: _3,
        ...prevPropsWithoutChildren
    } = prevProps;
    const {
        children: _4,
        expand: _5,
        row: _6,
        ...nextPropsWithoutChildren
    } = nextProps;
    return shallowEqual(prevPropsWithoutChildren, nextPropsWithoutChildren);
};

export const PureDatagridBody = memo(DatagridBody, areEqual);

// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
PureDatagridBody.muiName = 'TableBody';
// @ts-ignore
PureDatagridBody.defaultProps = {
    row: <PureDatagridRow />,
};

export default DatagridBody;
