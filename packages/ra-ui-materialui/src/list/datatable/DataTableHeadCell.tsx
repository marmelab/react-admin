import * as React from 'react';
import {
    FieldTitle,
    useTranslate,
    useDataTableCallbacksContext,
    useDataTableSortContext,
    useDataTableStoreContext,
    useResourceContext,
    useStore,
    useTranslateLabel,
    type SortPayload,
} from 'ra-core';
import {
    TableCell,
    TableSortLabel,
    Tooltip,
    useThemeProps,
} from '@mui/material';
import { type ComponentsOverrides, styled } from '@mui/material/styles';
import clsx from 'clsx';

import type { DataTableColumnProps } from './DataTableColumn';
import { DataTableClasses } from './DataTableRoot';

const oppositeOrder: Record<SortPayload['order'], SortPayload['order']> = {
    ASC: 'DESC',
    DESC: 'ASC',
};

const PREFIX = 'RaDataTableHeadCell';

export const DataTableHeadCell = React.memo(
    React.forwardRef<HTMLTableCellElement, DataTableColumnProps>(
        (inProps, ref) => {
            const props = useThemeProps({
                props: inProps,
                name: PREFIX,
            });
            const {
                cellSx,
                className,
                cellClassName,
                disableSort,
                headerClassName,
                field,
                render,
                source,
                label,
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
                <TableCellStyled
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
                    {handleSort && sort && !disableSort && source ? (
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
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                        />
                    )}
                </TableCellStyled>
            );
        }
    )
);

DataTableHeadCell.displayName = 'DataTableHeadCell';

const TableCellStyled = styled(TableCell, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaDataTableHeadCell: 'root';
    }

    interface ComponentsPropsList {
        RaDataTableHeadCell: Partial<DataTableColumnProps>;
    }

    interface Components {
        RaDataTableHeadCell?: {
            defaultProps?: ComponentsPropsList['RaDataTableHeadCell'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaDataTableHeadCell'];
        };
    }
}
