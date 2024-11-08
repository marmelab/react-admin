import * as React from 'react';
import { styled } from '@mui/material/styles';
import { memo } from 'react';
import clsx from 'clsx';
import { TableCell, TableSortLabel, Tooltip } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell';
import {
    FieldTitle,
    useTranslate,
    useResourceContext,
    useTranslateLabel,
} from 'ra-core';
import type { SortPayload } from 'ra-core';

const oppositeOrder: Record<SortPayload['order'], SortPayload['order']> = {
    ASC: 'DESC',
    DESC: 'ASC',
};

export const DatagridHeaderCell = (
    props: DatagridHeaderCellProps
): JSX.Element => {
    const { className, field, sort, updateSort, isSorting, ...rest } = props;
    const resource = useResourceContext();

    const translate = useTranslate();
    const translateLabel = useTranslateLabel();
    const nextSortOrder = field
        ? sort && sort.field === (field.props.sortBy || field.props.source)
            ? // active sort field, use opposite order
              oppositeOrder[sort.order]
            : // non active sort field, use default order
              field?.props.sortByOrder ?? 'ASC'
        : undefined;
    const fieldLabel = field
        ? translateLabel({
              label:
                  typeof field.props.label === 'string'
                      ? field.props.label
                      : undefined,
              resource,
              source: field.props.source,
          })
        : undefined;
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
        <StyledTableCell
            className={clsx(className, field?.props.headerClassName)}
            align={field?.props.textAlign || field?.type.textAlign}
            variant="head"
            {...rest}
        >
            {updateSort &&
            sort &&
            field &&
            field.props.sortable !== false &&
            field.type.sortable !== false &&
            (field.props.sortBy || field.props.source) ? (
                <Tooltip
                    title={sortLabel}
                    placement={
                        field.props.textAlign === 'right' ||
                        field.type.textAlign === 'right'
                            ? 'bottom-end'
                            : 'bottom-start'
                    }
                    enterDelay={300}
                >
                    <TableSortLabel
                        active={
                            sort.field ===
                            (field.props.sortBy || field.props.source)
                        }
                        direction={sort.order === 'ASC' ? 'asc' : 'desc'}
                        data-field={field.props.sortBy || field.props.source}
                        data-order={field.props.sortByOrder || 'ASC'}
                        onClick={updateSort}
                        classes={DatagridHeaderCellClasses}
                    >
                        <FieldTitle
                            label={field.props.label}
                            source={field.props.source}
                            resource={resource}
                        />
                    </TableSortLabel>
                </Tooltip>
            ) : (
                <FieldTitle
                    label={field?.props.label}
                    source={field?.props.source}
                    resource={resource}
                />
            )}
        </StyledTableCell>
    );
};

export interface DatagridHeaderCellProps
    extends Omit<TableCellProps, 'classes' | 'resource'> {
    className?: string;
    field?: JSX.Element;
    isSorting?: boolean;
    sort?: SortPayload;
    updateSort?: (event: any) => void;
}

export default memo(
    DatagridHeaderCell,
    (props, nextProps) =>
        props.updateSort === nextProps.updateSort &&
        props.sort?.field === nextProps.sort?.field &&
        props.sort?.order === nextProps.sort?.order &&
        props.isSorting === nextProps.isSorting
);

const PREFIX = 'RaDatagridHeaderCell';

export const DatagridHeaderCellClasses = {
    icon: `${PREFIX}-icon`,
};

// Remove the sort icons when not active
const StyledTableCell = styled(TableCell, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .MuiTableSortLabel-icon`]: {
        display: 'none',
    },
    [`& .Mui-active .MuiTableSortLabel-icon`]: {
        display: 'inline',
    },
});
