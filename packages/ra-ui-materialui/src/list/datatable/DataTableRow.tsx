import React, {
    isValidElement,
    createElement,
    useState,
    useEffect,
    useCallback,
} from 'react';
import clsx from 'clsx';
import { TableCell, TableRow, type TableRowProps } from '@mui/material';
import {
    useExpanded,
    useResourceContext,
    useRecordContext,
    useGetPathForRecordCallback,
    useResourceDefinition,
} from 'ra-core';
import { useNavigate } from 'react-router-dom';

import ExpandRowButton from '../datagrid/ExpandRowButton';

import { DataTableClasses } from './DataTableRoot';
import { useDataTableConfigContext } from './context/DataTableConfigContext';
import { SelectRowTableCell } from './SelectRowTableCell';
import { useDataTableCallbacksContext } from './context';

const computeNbColumns = (expand, children, hasBulkActions) =>
    expand
        ? 1 + // show expand button
          (hasBulkActions ? 1 : 0) + // checkbox column
          React.Children.toArray(children).filter(child => !!child).length // non-null children
        : 0; // we don't need to compute columns if there is no expand panel;

export interface DataTableRowProps
    extends Omit<TableRowProps, 'id' | 'classes'> {
    id: string;
}

export const DataTableRow = React.memo(
    React.forwardRef<HTMLTableRowElement, DataTableRowProps>((props, ref) => {
        const { children, className, id, ...rest } = props;
        const {
            expand,
            expandSingle,
            hasBulkActions = false,
            hover = true,
        } = useDataTableConfigContext();

        const { handleToggleItem, isRowExpandable, isRowSelectable, rowClick } =
            useDataTableCallbacksContext();

        if (typeof id === 'undefined') {
            throw new Error('DatagridRow expects an id prop');
        }
        const record = useRecordContext(props);
        if (!record) {
            throw new Error(
                'DatagridRow can only be used within a RecordContext or be passed a record prop'
            );
        }
        const resource = useResourceContext(props);
        const resourceDefinition = useResourceDefinition(props);
        const hasDetailView =
            resourceDefinition.hasShow || resourceDefinition.hasEdit;
        if (!resource) {
            throw new Error(
                'DatagridRow can only be used within a ResourceContext or be passed a resource prop'
            );
        }
        const selectable = !isRowSelectable || isRowSelectable(record);
        const expandable =
            (!isRowExpandable || isRowExpandable(record)) && expand;
        const [expanded, toggleExpanded] = useExpanded(
            resource,
            id,
            expandSingle
        );
        const [nbColumns, setNbColumns] = useState(() =>
            computeNbColumns(expandable, children, hasBulkActions)
        );
        useEffect(() => {
            // Fields can be hidden dynamically based on permissions;
            // The expand panel must span over the remaining columns
            // So we must recompute the number of columns to span on
            const newNbColumns = computeNbColumns(
                expandable,
                children,
                hasBulkActions
            );
            if (newNbColumns !== nbColumns) {
                setNbColumns(newNbColumns);
            }
        }, [expandable, nbColumns, children, hasBulkActions]);

        const navigate = useNavigate();

        const handleToggleExpand = useCallback(
            event => {
                toggleExpanded();
                event.stopPropagation();
            },
            [toggleExpanded]
        );
        const handleToggleSelection = useCallback(
            event => {
                if (!selectable || !handleToggleItem) return;
                handleToggleItem(id, event);
                event.stopPropagation();
            },
            [id, handleToggleItem, selectable]
        );

        const getPathForRecord = useGetPathForRecordCallback();

        const handleClick = useCallback(
            async event => {
                event.persist();
                let temporaryLink =
                    typeof rowClick === 'function'
                        ? rowClick(record.id, resource, record)
                        : rowClick;

                const link = isPromise(temporaryLink)
                    ? await temporaryLink
                    : temporaryLink;

                if (link === 'expand') {
                    handleToggleExpand(event);
                    return;
                }
                if (link === 'toggleSelection') {
                    handleToggleSelection(event);
                    return;
                }
                const path = await getPathForRecord({
                    record,
                    resource,
                    link,
                });
                if (path === false || path == null) {
                    return;
                }
                navigate(path, {
                    state: { _scrollToTop: true },
                });
            },
            [
                record,
                resource,
                rowClick,
                navigate,
                handleToggleExpand,
                handleToggleSelection,
                getPathForRecord,
            ]
        );

        return (
            <>
                <TableRow
                    ref={ref}
                    className={clsx(className, {
                        [DataTableClasses.expandable]: expandable,
                        [DataTableClasses.selectable]: selectable,
                        [DataTableClasses.clickableRow]:
                            rowClick ?? hasDetailView,
                    })}
                    key={id}
                    hover={hover}
                    onClick={handleClick}
                    {...rest}
                >
                    {expand && (
                        <TableCell
                            padding="none"
                            className={DataTableClasses.expandIconCell}
                        >
                            {expandable && (
                                <ExpandRowButton
                                    className={clsx(
                                        DataTableClasses.expandIcon,
                                        {
                                            [DataTableClasses.expanded]:
                                                expanded,
                                        }
                                    )}
                                    expanded={expanded}
                                    onClick={handleToggleExpand}
                                    expandContentId={`${id}-expand`}
                                />
                            )}
                        </TableCell>
                    )}
                    {hasBulkActions && <SelectRowTableCell />}
                    {children}
                </TableRow>
                {expandable && expanded && (
                    <TableRow
                        key={`${id}-expand`}
                        id={`${id}-expand`}
                        className={DataTableClasses.expandedPanel}
                    >
                        <TableCell colSpan={nbColumns}>
                            {isValidElement(expand)
                                ? expand
                                : createElement(
                                      expand as React.FunctionComponent<any>
                                  )}
                        </TableCell>
                    </TableRow>
                )}
            </>
        );
    })
);

DataTableRow.displayName = 'DataTableRow';

const isPromise = (value: any): value is Promise<any> =>
    value && typeof value.then === 'function';
