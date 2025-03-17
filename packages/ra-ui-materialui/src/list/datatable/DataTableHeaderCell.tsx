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

import { useDataTableContext } from './DataTableContext';
import { DataTableColumnProps } from './DataTableColumn';

const oppositeOrder: Record<SortPayload['order'], SortPayload['order']> = {
    ASC: 'DESC',
    DESC: 'ASC',
};

export const DataTableHeaderCell = React.forwardRef<
    HTMLTableCellElement,
    DataTableColumnProps
>((props, ref) => {
    const {
        className,
        cellClassName,
        headerClassName,
        component,
        render,
        source,
        label,
        sortable,
        sortByOrder,
        ...rest
    } = props;
    const { storeKey, sort, handleSort } = useDataTableContext();
    const [hiddenColumns] = useStore<string[]>(storeKey, []);
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
                ? fieldLabel.charAt(0).toLowerCase() + fieldLabel.slice(1)
                : undefined,
        order: translate(`ra.sort.${nextSortOrder}`),
        _: translate('ra.action.sort'),
    });
    return (
        <TableCell
            ref={ref}
            className={clsx(className, headerClassName, `column-${source}`)}
            variant="head"
            {...rest}
        >
            {handleSort && sort && sortable !== false && source ? (
                <Tooltip
                    title={sortLabel}
                    placement={
                        props.align === 'right' ? 'bottom-end' : 'bottom-start'
                    }
                    enterDelay={300}
                >
                    <TableSortLabel
                        active={sort.field === source}
                        direction={sort.order === 'ASC' ? 'asc' : 'desc'}
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
                <FieldTitle label={label} source={source} resource={resource} />
            )}
        </TableCell>
    );
});

DataTableHeaderCell.displayName = 'DataTableHeaderCell';
