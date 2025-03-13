import * as React from 'react';
import { useCallback, useState } from 'react';
import {
    useListContextWithProps,
    useTranslate,
    type RaRecord,
    type SortPayload,
    type Identifier,
} from 'ra-core';
import {
    Checkbox,
    ListItemText,
    ListSubheader,
    TableCell,
    TableHead,
    TableRow,
    Menu,
    IconButton,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';

import { DatagridClasses } from '../datagrid/useDatagridStyles';
import ExpandAllButton from '../datagrid/ExpandAllButton';
import { useDatagridContext } from '../datagrid/useDatagridContext';
import { DataTableHeaderContext } from './DataTableHeaderContext';
import { DataTableColumnSelectorContext } from './DataTableColumnSelectorContext';

/**
 * The default Datagrid Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const DataTableHeader = (props: DataTableHeaderProps) => {
    const {
        children,
        className,
        hasExpand = false,
        hasBulkActions = false,
        isRowSelectable,
    } = props;

    const translate = useTranslate();
    const { sort, data, onSelect, selectedIds, setSort } =
        useListContextWithProps(props);
    const { expandSingle } = useDatagridContext();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const updateSortCallback = useCallback(
        event => {
            event.stopPropagation();
            if (!setSort) return;
            const newField = event.currentTarget.dataset.field;
            const newOrder =
                sort?.field === newField
                    ? sort?.order === 'ASC'
                        ? 'DESC'
                        : 'ASC'
                    : event.currentTarget.dataset.order;
            setSort({ field: newField, order: newOrder });
        },
        [sort?.field, sort?.order, setSort]
    );

    const updateSort = setSort ? updateSortCallback : undefined;

    const handleSelectAll = useCallback(
        event => {
            if (!onSelect || !selectedIds || !data) return;
            onSelect(
                event.target.checked
                    ? selectedIds.concat(
                          data
                              .filter(
                                  record => !selectedIds.includes(record.id)
                              )
                              .filter(record =>
                                  isRowSelectable
                                      ? isRowSelectable(record)
                                      : true
                              )
                              .map(record => record.id)
                      )
                    : []
            );
        },
        [data, onSelect, isRowSelectable, selectedIds]
    );

    const selectableIds = Array.isArray(data)
        ? isRowSelectable
            ? data
                  .filter(record => isRowSelectable(record))
                  .map(record => record.id)
            : data.map(record => record.id)
        : [];

    const handleOpenColumnSelectMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        );
    };

    const handleCloseColumnSelectMenu = () => {
        setContextMenu(null);
    };

    return (
        <DataTableHeaderContext.Provider value={{ sort, updateSort }}>
            <TableHead
                className={clsx(className, DatagridClasses.thead)}
                onContextMenu={handleOpenColumnSelectMenu}
            >
                <TableRow
                    className={clsx(
                        DatagridClasses.row,
                        DatagridClasses.headerRow
                    )}
                >
                    {hasExpand && (
                        <TableCell
                            padding="none"
                            className={clsx(
                                DatagridClasses.headerCell,
                                DatagridClasses.expandHeader
                            )}
                        >
                            {!expandSingle && data ? (
                                <ExpandAllButton
                                    ids={data.map(record => record.id)}
                                />
                            ) : null}
                        </TableCell>
                    )}
                    {hasBulkActions && selectedIds && (
                        <TableCell
                            padding="checkbox"
                            className={DatagridClasses.headerCell}
                        >
                            <Checkbox
                                inputProps={{
                                    'aria-label': translate(
                                        'ra.action.select_all',
                                        { _: 'Select all' }
                                    ),
                                }}
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
                                onClick={e => e.stopPropagation()}
                            />
                        </TableCell>
                    )}
                    {children}
                </TableRow>
            </TableHead>
            <DataTableColumnSelectorContext.Provider value={true}>
                <Menu
                    MenuListProps={{ dense: true }}
                    open={contextMenu !== null}
                    onClose={handleCloseColumnSelectMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? {
                                  top: contextMenu.mouseY,
                                  left: contextMenu.mouseX,
                              }
                            : undefined
                    }
                >
                    <ListSubheader
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <ListItemText>
                            {translate('ra.action.choose_columns', {
                                _: 'Choose columns',
                            })}
                        </ListItemText>
                        <IconButton
                            size="small"
                            onClick={handleCloseColumnSelectMenu}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </ListSubheader>
                    <Divider />
                    {children}
                </Menu>
            </DataTableColumnSelectorContext.Provider>
        </DataTableHeaderContext.Provider>
    );
};

export interface DataTableHeaderProps<RecordType extends RaRecord = any> {
    children?: React.ReactNode;
    className?: string;
    hasExpand?: boolean;
    hasBulkActions?: boolean;
    isRowSelectable?: (record: RecordType) => boolean;
    isRowExpandable?: (record: RecordType) => boolean;
    size?: 'medium' | 'small';
    // can be injected when using the component without context
    sort?: SortPayload;
    data?: RecordType[];
    onSelect?: (ids: Identifier[]) => void;
    onToggleItem?: (id: Identifier) => void;
    selectedIds?: Identifier[];
    setSort?: (sort: SortPayload) => void;
}

DataTableHeader.displayName = 'DatagridHeaderModern';
