import * as React from 'react';
import { Children, isValidElement, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    useListContext,
    useResourceContext,
    Identifier,
    Record,
    RecordMap,
    SortPayload,
    useTranslate,
} from 'ra-core';
import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import { DatagridClasses } from './useDatagridStyles';

/**
 * The default Datagrid Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const DatagridHeader = (props: DatagridHeaderProps) => {
    const {
        children,
        className,
        hasExpand = false,
        hasBulkActions = false,
        isRowSelectable,
    } = props;
    const resource = useResourceContext(props);
    const translate = useTranslate();
    const {
        currentSort,
        data,
        ids,
        onSelect,
        selectedIds,
        setSort,
    } = useListContext(props);

    const updateSortCallback = useCallback(
        event => {
            event.stopPropagation();
            const newField = event.currentTarget.dataset.field;
            const newOrder =
                currentSort.field === newField
                    ? currentSort.order === 'ASC'
                        ? 'DESC'
                        : 'ASC'
                    : event.currentTarget.dataset.order;

            setSort(newField, newOrder);
        },
        [currentSort.field, currentSort.order, setSort]
    );

    const updateSort = setSort ? updateSortCallback : null;

    const handleSelectAll = useCallback(
        event => {
            if (event.target.checked) {
                const all = ids.concat(
                    selectedIds.filter(id => !ids.includes(id))
                );
                onSelect(
                    isRowSelectable
                        ? all.filter(id => isRowSelectable(data[id]))
                        : all
                );
            } else {
                onSelect([]);
            }
        },
        [data, ids, onSelect, isRowSelectable, selectedIds]
    );

    const selectableIds = isRowSelectable
        ? ids.filter(id => isRowSelectable(data[id]))
        : ids;

    return (
        <TableHead className={classnames(className, DatagridClasses.thead)}>
            <TableRow
                className={classnames(
                    DatagridClasses.row,
                    DatagridClasses.headerRow
                )}
            >
                {hasExpand && (
                    <TableCell
                        padding="none"
                        className={classnames(
                            DatagridClasses.headerCell,
                            DatagridClasses.expandHeader
                        )}
                    />
                )}
                {hasBulkActions && selectedIds && (
                    <TableCell
                        padding="checkbox"
                        className={DatagridClasses.headerCell}
                    >
                        <Checkbox
                            aria-label={translate('ra.action.select_all', {
                                _: 'Select all',
                            })}
                            className="select-all"
                            color="primary"
                            checked={
                                selectedIds.length > 0 &&
                                selectableIds.length > 0 &&
                                selectableIds.every(id =>
                                    selectedIds.includes(id)
                                )
                            }
                            onChange={handleSelectAll}
                        />
                    </TableCell>
                )}
                {Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <DatagridHeaderCell
                            className={DatagridClasses.headerCell}
                            currentSort={currentSort}
                            field={field}
                            isSorting={
                                currentSort.field ===
                                ((field.props as any).sortBy ||
                                    (field.props as any).source)
                            }
                            key={(field.props as any).source || index}
                            resource={resource}
                            updateSort={updateSort}
                        />
                    ) : null
                )}
            </TableRow>
        </TableHead>
    );
};

DatagridHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    currentSort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.any,
    hasExpand: PropTypes.bool,
    hasBulkActions: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.any),
    isRowSelectable: PropTypes.func,
    isRowExpandable: PropTypes.func,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    setSort: PropTypes.func,
};

export interface DatagridHeaderProps<RecordType extends Record = Record> {
    children?: React.ReactNode;
    className?: string;
    hasExpand?: boolean;
    hasBulkActions?: boolean;
    isRowSelectable?: (record: Record) => boolean;
    isRowExpandable?: (record: Record) => boolean;
    size?: 'medium' | 'small';
    // can be injected when using the component without context
    currentSort?: SortPayload;
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    onSelect?: (ids: Identifier[]) => void;
    onToggleItem?: (id: Identifier) => void;
    resource?: string;
    selectedIds?: Identifier[];
    setSort?: (sort: string, order?: string) => void;
}

DatagridHeader.displayName = 'DatagridHeader';
