import React, {
    isValidElement,
    createElement,
    useState,
    useEffect,
    useCallback,
} from 'react';
import clsx from 'clsx';
import {
    Collapse,
    TableCell,
    TableRow,
    useThemeProps,
    type TableRowProps,
} from '@mui/material';
import { type ComponentsOverrides, styled } from '@mui/material/styles';
import {
    useDataTableCallbacksContext,
    useDataTableConfigContext,
    useExpanded,
    useResourceContext,
    useRecordContext,
    useGetPathForRecordCallback,
    useResourceDefinition,
} from 'ra-core';
import { useNavigate } from 'react-router-dom';

import ExpandRowButton from '../datagrid/ExpandRowButton';
import { DataTableClasses } from './DataTableRoot';
import { SelectRowCheckbox } from './SelectRowCheckbox';

const computeNbColumns = (expand, children, hasBulkActions) =>
    expand
        ? 1 + // show expand button
          (hasBulkActions ? 1 : 0) + // checkbox column
          React.Children.toArray(children).filter(child => !!child).length // non-null children
        : 0; // we don't need to compute columns if there is no expand panel;

const PREFIX = 'RaDataTableRow';

export interface DataTableRowProps extends Omit<TableRowProps, 'classes'> {}

export const DataTableRow = React.memo(
    React.forwardRef<HTMLTableRowElement, DataTableRowProps>((inProps, ref) => {
        const props = useThemeProps({
            props: inProps,
            name: PREFIX,
        });
        const { children, className, ...rest } = props;
        const {
            expand,
            expandSingle,
            hasBulkActions = false,
            hover = true,
        } = useDataTableConfigContext();

        const { handleToggleItem, isRowExpandable, isRowSelectable, rowClick } =
            useDataTableCallbacksContext();

        const record = useRecordContext(props);
        if (!record) {
            throw new Error(
                'DataTableRow can only be used within a RecordContext or be passed a record prop'
            );
        }
        const resource = useResourceContext(props);
        const resourceDefinition = useResourceDefinition(props);
        const hasDetailView =
            resourceDefinition.hasShow || resourceDefinition.hasEdit;
        if (!resource) {
            throw new Error(
                'DataTableRow can only be used within a ResourceContext or be passed a resource prop'
            );
        }
        const selectable = !isRowSelectable || isRowSelectable(record);
        const expandable =
            (!isRowExpandable || isRowExpandable(record)) && expand;
        const [expanded, toggleExpanded] = useExpanded(
            resource,
            record.id,
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
                handleToggleItem(record.id, event);
                event.stopPropagation();
            },
            [record.id, handleToggleItem, selectable]
        );

        const getPathForRecord = useGetPathForRecordCallback();

        const handleClick = useCallback(
            async event => {
                event.persist();
                const temporaryLink =
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
                <TableRowStyled
                    ref={ref}
                    className={clsx(className, {
                        [DataTableClasses.expandable]: expandable,
                        [DataTableClasses.selectable]: selectable,
                        [DataTableClasses.clickableRow]:
                            rowClick ?? hasDetailView,
                    })}
                    key={record.id}
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
                                    expandContentId={`${resource}-${record.id}-expand`}
                                />
                            )}
                        </TableCell>
                    )}
                    {hasBulkActions && handleToggleItem && (
                        <TableCell padding="checkbox">
                            <SelectRowCheckbox />
                        </TableCell>
                    )}
                    {children}
                </TableRowStyled>
                {expandable && (
                    <TableRow
                        key={`${record.id}-expand`}
                        id={`${resource}-${record.id}-expand`}
                        className={DataTableClasses.expandRow}
                    >
                        <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={nbColumns}
                        >
                            <Collapse
                                in={expanded}
                                timeout="auto"
                                unmountOnExit
                            >
                                {isValidElement(expand)
                                    ? expand
                                    : createElement(
                                          expand as React.FunctionComponent<any>
                                      )}
                            </Collapse>
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

const TableRowStyled = styled(TableRow, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaDataTableRow: 'root';
    }

    interface ComponentsPropsList {
        RaDataTableRow: Partial<DataTableRowProps>;
    }

    interface Components {
        RaDataTableRow?: {
            defaultProps?: ComponentsPropsList['RaDataTableRow'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaDataTableRow'];
        };
    }
}
