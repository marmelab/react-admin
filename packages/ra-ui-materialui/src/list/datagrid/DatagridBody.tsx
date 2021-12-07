import * as React from 'react';
import { cloneElement, memo, FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { TableBody, TableBodyProps } from '@mui/material';
import classnames from 'classnames';
import { Identifier, Record } from 'ra-core';

import { DatagridClasses } from './useDatagridStyles';
import DatagridRow, { PureDatagridRow, RowClickFunction } from './DatagridRow';

const DatagridBody: FC<DatagridBodyProps> = React.forwardRef(
    (
        {
            basePath,
            children,
            className,
            data,
            expand,
            hasBulkActions,
            hover,
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
            className={classnames(
                'datagrid-body',
                className,
                DatagridClasses.tbody
            )}
            {...rest}
        >
            {data.map((record, rowIndex) =>
                cloneElement(
                    row,
                    {
                        basePath,
                        className: classnames(DatagridClasses.row, {
                            [DatagridClasses.rowEven]: rowIndex % 2 === 0,
                            [DatagridClasses.rowOdd]: rowIndex % 2 !== 0,
                            [DatagridClasses.clickableRow]: rowClick,
                        }),
                        expand,
                        hasBulkActions: hasBulkActions && !!selectedIds,
                        hover,
                        id: record.id,
                        key: record.id,
                        onToggleItem,
                        record,
                        resource,
                        rowClick,
                        selectable: !isRowSelectable || isRowSelectable(record),
                        selected: selectedIds?.includes(record.id),
                        style: rowStyle ? rowStyle(record, rowIndex) : null,
                    },
                    children
                )
            )}
        </TableBody>
    )
);

DatagridBody.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    // @ts-ignore
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
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
    data: [],
    hasBulkActions: false,
    row: <DatagridRow />,
};

export interface DatagridBodyProps extends Omit<TableBodyProps, 'classes'> {
    basePath?: string;
    className?: string;
    data?: any[];
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

export const PureDatagridBody = memo(DatagridBody);

// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
PureDatagridBody.muiName = 'TableBody';
// @ts-ignore
PureDatagridBody.defaultProps = {
    row: <PureDatagridRow />,
};

export default DatagridBody;
