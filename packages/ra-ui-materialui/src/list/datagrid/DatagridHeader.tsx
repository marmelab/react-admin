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
import { Checkbox, TableCell, TableHead, TableRow } from '@material-ui/core';
import classnames from 'classnames';

import DatagridHeaderCell from './DatagridHeaderCell';
import useDatagridStyles from './useDatagridStyles';
import { ClassesOverride } from '../../types';

/**
 * The default Datagrid Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const DatagridHeader = (props: DatagridHeaderProps) => {
    const {
        children,
        classes,
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
            onSelect(
                event.target.checked
                    ? ids
                          .filter(id =>
                              isRowSelectable ? isRowSelectable(data[id]) : true
                          )
                          .concat(selectedIds.filter(id => !ids.includes(id)))
                    : []
            );
        },
        [data, ids, onSelect, isRowSelectable, selectedIds]
    );

    const selectableIds = isRowSelectable
        ? ids.filter(id => isRowSelectable(data[id]))
        : ids;

    return (
        <TableHead className={classnames(className, classes.thead)}>
            <TableRow className={classnames(classes.row, classes.headerRow)}>
                {hasExpand && (
                    <TableCell
                        padding="none"
                        className={classnames(
                            classes.headerCell,
                            classes.expandHeader
                        )}
                    />
                )}
                {hasBulkActions && selectedIds && (
                    <TableCell
                        padding="checkbox"
                        className={classes.headerCell}
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
                            className={classes.headerCell}
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
    classes: PropTypes.object,
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
    classes?: ClassesOverride<typeof useDatagridStyles>;
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
