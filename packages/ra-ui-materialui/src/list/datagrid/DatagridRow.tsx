import React, {
    isValidElement,
    createElement,
    useState,
    useEffect,
    useCallback,
    memo,
    FC,
    ReactElement,
} from 'react';
import clsx from 'clsx';
import { TableCell, TableRow, TableRowProps, Checkbox } from '@mui/material';
import {
    Identifier,
    RaRecord,
    shallowEqual,
    useExpanded,
    useResourceContext,
    useTranslate,
    useRecordContext,
    useGetPathForRecordCallback,
    useResourceDefinition,
} from 'ra-core';
import { useNavigate } from 'react-router-dom';

import DatagridCell from './DatagridCell';
import ExpandRowButton from './ExpandRowButton';
import { DatagridClasses } from './useDatagridStyles';
import { useDatagridContext } from './useDatagridContext';

const computeNbColumns = (expand, children, hasBulkActions) =>
    expand
        ? 1 + // show expand button
          (hasBulkActions ? 1 : 0) + // checkbox column
          React.Children.toArray(children).filter(child => !!child).length // non-null children
        : 0; // we don't need to compute columns if there is no expand panel;

const DatagridRow: React.ForwardRefExoticComponent<
    Omit<DatagridRowProps, 'ref'> & React.RefAttributes<HTMLTableRowElement>
> = React.forwardRef<HTMLTableRowElement, DatagridRowProps>((props, ref) => {
    const {
        children,
        className,
        expand,
        hasBulkActions = false,
        hover = true,
        id,
        onToggleItem,
        record: recordOverride,
        rowClick,
        selected = false,
        style,
        selectable = true,
        ...rest
    } = props;

    if (typeof id === 'undefined') {
        throw new Error('DatagridRow expects an id prop');
    }
    const context = useDatagridContext();
    const translate = useTranslate();
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
    const expandable =
        (!context ||
            !context.isRowExpandable ||
            context.isRowExpandable(record)) &&
        expand;
    const [expanded, toggleExpanded] = useExpanded(
        resource,
        id,
        context && context.expandSingle
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
            if (!selectable || !onToggleItem) return;
            onToggleItem(id, event);
            event.stopPropagation();
        },
        [id, onToggleItem, selectable]
    );

    const getPathForRecord = useGetPathForRecordCallback();

    const handleClick = useCallback(
        async event => {
            event.persist();
            const path = await getPathForRecord({
                record,
                resource,
                link:
                    typeof rowClick === 'function'
                        ? (record, resource) =>
                              rowClick(record.id, resource, record)
                        : rowClick,
            });
            if (rowClick === 'expand') {
                handleToggleExpand(event);
                return;
            }
            if (rowClick === 'toggleSelection') {
                handleToggleSelection(event);
                return;
            }
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
                    [DatagridClasses.expandable]: expandable,
                    [DatagridClasses.selectable]: selectable,
                    [DatagridClasses.clickableRow]: rowClick ?? hasDetailView,
                })}
                key={id}
                style={style}
                hover={hover}
                onClick={handleClick}
                {...rest}
            >
                {expand && (
                    <TableCell
                        padding="none"
                        className={DatagridClasses.expandIconCell}
                    >
                        {expandable && (
                            <ExpandRowButton
                                className={clsx(DatagridClasses.expandIcon, {
                                    [DatagridClasses.expanded]: expanded,
                                })}
                                expanded={expanded}
                                onClick={handleToggleExpand}
                                expandContentId={`${id}-expand`}
                            />
                        )}
                    </TableCell>
                )}
                {hasBulkActions && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            aria-label={translate('ra.action.select_row', {
                                _: 'Select this row',
                            })}
                            color="primary"
                            className={`select-item ${DatagridClasses.checkbox}`}
                            checked={selectable && selected}
                            onClick={handleToggleSelection}
                            disabled={!selectable}
                        />
                    </TableCell>
                )}
                {React.Children.map(children, (field, index) =>
                    isValidElement(field) ? (
                        <DatagridCell
                            key={`${id}-${
                                (field.props as any).source || index
                            }`}
                            className={clsx(
                                `column-${(field.props as any).source}`,
                                DatagridClasses.rowCell
                            )}
                            record={record}
                            {...{ field, resource }}
                        />
                    ) : null
                )}
            </TableRow>
            {expandable && expanded && (
                <TableRow
                    key={`${id}-expand`}
                    id={`${id}-expand`}
                    className={DatagridClasses.expandedPanel}
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
});

export interface DatagridRowProps
    extends Omit<TableRowProps, 'id' | 'classes'> {
    className?: string;
    expand?:
        | ReactElement
        | FC<{
              id: Identifier;
              record: RaRecord;
              resource: string;
          }>;
    hasBulkActions?: boolean;
    hover?: boolean;
    id?: Identifier;
    onToggleItem?: (
        id: Identifier,
        event: React.TouchEvent | React.MouseEvent
    ) => void;
    record?: RaRecord;
    resource?: string;
    rowClick?: RowClickFunction | string | false;
    selected?: boolean;
    style?: any;
    selectable?: boolean;
}

export type RowClickFunction = (
    id: Identifier,
    resource: string,
    record: RaRecord
) => string | false | Promise<string | false>;

const areEqual = (prevProps, nextProps) => {
    const { children: _1, expand: _2, ...prevPropsWithoutChildren } = prevProps;
    const { children: _3, expand: _4, ...nextPropsWithoutChildren } = nextProps;
    return shallowEqual(prevPropsWithoutChildren, nextPropsWithoutChildren);
};

export const PureDatagridRow = memo(DatagridRow, areEqual);

PureDatagridRow.displayName = 'PureDatagridRow';

export default DatagridRow;
