import * as React from 'react';
import {
    FieldTitle,
    useTranslate,
    useResourceContext,
    useStore,
    useTranslateLabel,
    type SortPayload,
} from 'ra-core';
import { TableCell, TableSortLabel, Tooltip } from '@mui/material';
import clsx from 'clsx';

import { DataTableColumnProps } from './DataTableColumn';
import {
    useDataTableCallbacksContext,
    useDataTableSortContext,
    useDataTableStoreContext,
} from './context';
import { DataTableClasses } from './DataTableRoot';

const oppositeOrder: Record<SortPayload['order'], SortPayload['order']> = {
    ASC: 'DESC',
    DESC: 'ASC',
};

export const DataTableHeaderCell = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (props, ref) => {
            const {
                className,
                cellClassName,
                headerClassName,
                field,
                render,
                source,
                label,
                sortable,
                sortByOrder,
                ...rest
            } = props;
            const { storeKey, defaultHiddenColumns } =
                useDataTableStoreContext();
            const sort = useDataTableSortContext();
            const { handleSort } = useDataTableCallbacksContext();
            const [hiddenColumns] = useStore<string[]>(
                storeKey,
                defaultHiddenColumns
            );
            const resource = useResourceContext();
            const translate = useTranslate();
            const translateLabel = useTranslateLabel();
            const isColumnHidden = hiddenColumns.includes(source!);
            if (isColumnHidden) return null;
            const nextSortOrder =
                sort && sort.field === source
                    ? oppositeOrder[sort.order]
                    : sortByOrder ?? 'ASC';
            const fieldLabel = translateLabel({
                label: typeof label === 'string' ? label : undefined,
                resource,
                source,
            });
            const sortLabel = translate('ra.sort.sort_by', {
                field: fieldLabel,
                field_lower_first:
                    typeof fieldLabel === 'string'
                        ? fieldLabel.charAt(0).toLowerCase() +
                          fieldLabel.slice(1)
                        : undefined,
                order: translate(`ra.sort.${nextSortOrder}`),
                _: translate('ra.action.sort'),
            });
            return (
                <TableCell
                    ref={ref}
                    className={clsx(
                        DataTableClasses.headerCell,
                        className,
                        headerClassName,
                        `column-${source}`
                    )}
                    variant="head"
                    {...rest}
                >
                    {handleSort && sort && sortable !== false && source ? (
                        <Tooltip
                            title={sortLabel}
                            placement={
                                props.align === 'right'
                                    ? 'bottom-end'
                                    : 'bottom-start'
                            }
                            enterDelay={300}
                        >
                            <TableSortLabel
                                active={sort.field === source}
                                direction={
                                    sort.order === 'ASC' ? 'asc' : 'desc'
                                }
                                data-field={source}
                                data-order={sortByOrder || 'ASC'}
                                onClick={handleSort}
                            >
                                <FieldTitle
                                    label={label}
                                    source={source}
                                    resource={resource}
                                />
                            </TableSortLabel>
                        </Tooltip>
                    ) : (
                        <TableSortLabel disabled>
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={resource}
                            />
                        </TableSortLabel>
                    )}
                </TableCell>
            );
        }
    )
);

DataTableHeaderCell.displayName = 'DataTableHeaderCell';
