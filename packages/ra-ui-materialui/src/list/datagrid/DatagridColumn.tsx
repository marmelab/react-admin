import * as React from 'react';
import {
    FieldTitle,
    useTranslate,
    useRecordContext,
    useResourceContext,
    useTranslateLabel,
    type SortPayload,
} from 'ra-core';
import {
    TableCell,
    type TableCellProps,
    TableSortLabel,
    Tooltip,
} from '@mui/material';
import clsx from 'clsx';

import { DatagridHeaderContext } from './DatagridHeaderContext';
import { TextField } from '../../field/TextField';

const oppositeOrder: Record<SortPayload['order'], SortPayload['order']> = {
    ASC: 'DESC',
    DESC: 'ASC',
};

export interface DatagridColumnProps extends Omit<TableCellProps, 'component'> {
    cellClassName?: string;
    headerClassName?: string;
    render?: (record: any) => React.ReactNode;
    component?: React.ElementType;
    source?: string;
    label?: string;
    sortable?: boolean;
    sortBy?: string;
    sortByOrder?: SortPayload['order'];
}

export const DatagridColumn = React.forwardRef<
    HTMLTableCellElement,
    DatagridColumnProps
>((props, ref) => {
    const record = useRecordContext();
    const resource = useResourceContext();

    const translate = useTranslate();
    const translateLabel = useTranslateLabel();
    const headerContext = React.useContext(DatagridHeaderContext);
    if (headerContext) {
        // header cell
        const { sort, updateSort } = headerContext;
        const {
            className,
            cellClassName,
            headerClassName,
            component,
            render,
            source,
            label,
            sortable,
            sortBy,
            sortByOrder,
            ...rest
        } = props;
        const nextSortOrder =
            sort && sort.field === (sortBy || source)
                ? // active sort field, use opposite order
                  oppositeOrder[sort.order]
                : // non active sort field, use default order
                  sortByOrder ?? 'ASC';
        const fieldLabel = translateLabel({
            label: typeof label === 'string' ? label : undefined,
            resource,
            source: source,
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
                {updateSort &&
                sort &&
                sortable !== false &&
                (sortBy || source) ? (
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
                            active={sort.field === (sortBy || source)}
                            direction={sort.order === 'ASC' ? 'asc' : 'desc'}
                            data-field={sortBy || source}
                            data-order={sortByOrder || 'ASC'}
                            onClick={updateSort}
                        >
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={resource}
                            />
                        </TableSortLabel>
                    </Tooltip>
                ) : (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                    />
                )}
            </TableCell>
        );
    } else {
        // data cell
        const {
            cellClassName,
            headerClassName,
            children,
            className,
            render,
            component,
            source,
            sortable,
            sortBy,
            sortByOrder,
            label,
            ...rest
        } = props;
        if (!render && !component && !children && !source) {
            throw new Error(
                'Missing at least one of the following props: render, component, children, or source'
            );
        }
        return (
            <TableCell
                ref={ref}
                className={clsx(className, cellClassName, `column-${source}`)}
                {...rest}
            >
                {children ??
                    (render ? (
                        record && render(record)
                    ) : component ? (
                        React.createElement(component, { source })
                    ) : (
                        <TextField source={source!} />
                    ))}
            </TableCell>
        );
    }
});
