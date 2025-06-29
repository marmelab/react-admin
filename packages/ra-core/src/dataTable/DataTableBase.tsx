import * as React from 'react';
import { useEffect, useMemo, useRef, type FC, type ReactNode } from 'react';
import union from 'lodash/union';
import difference from 'lodash/difference';

import { OptionalResourceContextProvider, useResourceContext } from '../core';
import { useEvent } from '../util';
import { useListContextWithProps } from '../controller/list/useListContextWithProps';
import { type ListControllerResult } from '../controller/list/useListController';
import { type RowClickFunctionBase } from './types';
import { type Identifier, type RaRecord, type SortPayload } from '../types';
import { DataTableConfigContext } from './DataTableConfigContext';
import { DataTableCallbacksContext } from './DataTableCallbacksContext';
import { DataTableDataContext } from './DataTableDataContext';
import { DataTableSelectedIdsContext } from './DataTableSelectedIdsContext';
import { DataTableSortContext } from './DataTableSortContext';
import { DataTableStoreContext } from './DataTableStoreContext';

export const DataTableBase = function DataTable<
    RecordType extends RaRecord = any,
>(props: DataTableBaseProps<RecordType>) {
    const resourceFromContext = useResourceContext(props);

    const {
        children,
        empty,
        expand,
        hiddenColumns = emptyArray,
        hasBulkActions,
        hover,
        loading,
        isRowSelectable,
        isRowExpandable,
        resource,
        rowClick,
        expandSingle = false,
    } = props;

    const {
        sort,
        data,
        isPending,
        onSelect,
        onToggleItem,
        selectedIds,
        setSort,
        total,
    } = useListContextWithProps(props);

    const storeKey = props.storeKey || `${resourceFromContext}.datatable`;

    const handleSort = useEvent((event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        if (!setSort) return;
        const newField = event.currentTarget.dataset.field || 'id';
        const newOrder =
            sort?.field === newField
                ? sort?.order === 'ASC'
                    ? 'DESC'
                    : 'ASC'
                : (event.currentTarget.dataset.order as 'ASC') || 'ASC';
        setSort({ field: newField, order: newOrder });
    });

    const lastSelected = useRef<Identifier | null>(null);

    useEffect(() => {
        if (!selectedIds || selectedIds.length === 0) {
            lastSelected.current = null;
        }
    }, [JSON.stringify(selectedIds)]); // eslint-disable-line react-hooks/exhaustive-deps

    // we manage row selection here instead of in the rows level to allow shift+click to select an array of rows
    const handleToggleItem = useEvent(
        (id: Identifier, event: React.MouseEvent<HTMLInputElement>) => {
            if (!data) return;
            const ids = data.map(record => record.id);
            const lastSelectedIndex = ids.indexOf(lastSelected.current);
            // @ts-ignore FIXME useEvent prevents using event.currentTarget
            lastSelected.current = event.target.checked ? id : null;

            if (event.shiftKey && lastSelectedIndex !== -1) {
                const index = ids.indexOf(id);
                const idsBetweenSelections = ids.slice(
                    Math.min(lastSelectedIndex, index),
                    Math.max(lastSelectedIndex, index) + 1
                );

                // @ts-ignore FIXME useEvent prevents using event.currentTarget
                const newSelectedIds = event.target.checked
                    ? union(selectedIds, idsBetweenSelections)
                    : difference(selectedIds, idsBetweenSelections);

                onSelect?.(
                    isRowSelectable
                        ? newSelectedIds.filter((id: Identifier) =>
                              isRowSelectable(
                                  data.find(record => record.id === id)
                              )
                          )
                        : newSelectedIds
                );
            } else {
                onToggleItem?.(id);
            }
        }
    );

    const storeContextValue = useMemo(
        () => ({
            storeKey,
            defaultHiddenColumns: hiddenColumns,
        }),
        [storeKey, hiddenColumns]
    );

    const configContextValue = useMemo(
        () => ({
            expand,
            expandSingle,
            hasBulkActions,
            hover,
        }),
        [expand, expandSingle, hasBulkActions, hover]
    );

    const callbacksContextValue = useMemo(
        () => ({
            handleSort: setSort ? handleSort : undefined,
            handleToggleItem: onToggleItem ? handleToggleItem : undefined,
            isRowExpandable,
            isRowSelectable,
            onSelect,
            rowClick,
        }),
        [
            setSort,
            handleSort,
            handleToggleItem,
            isRowExpandable,
            isRowSelectable,
            onSelect,
            onToggleItem,
            rowClick,
        ]
    );

    if (isPending === true) {
        return loading;
    }

    /**
     * Once loaded, the data for the list may be empty. Instead of
     * displaying the table header with zero data rows,
     * the DataTable displays the empty component.
     */
    if (data == null || data.length === 0 || total === 0) {
        return empty ?? null;
    }

    /**
     * After the initial load, if the data for the list isn't empty,
     * and even if the data is refreshing (e.g. after a filter change),
     * the DataTable displays the current data.
     */
    return (
        <DataTableStoreContext.Provider value={storeContextValue}>
            <DataTableSortContext.Provider value={sort}>
                <DataTableSelectedIdsContext.Provider value={selectedIds}>
                    <DataTableCallbacksContext.Provider
                        value={callbacksContextValue}
                    >
                        <DataTableConfigContext.Provider
                            value={configContextValue}
                        >
                            <OptionalResourceContextProvider value={resource}>
                                <DataTableDataContext.Provider value={data}>
                                    {children}
                                </DataTableDataContext.Provider>
                            </OptionalResourceContextProvider>
                        </DataTableConfigContext.Provider>
                    </DataTableCallbacksContext.Provider>
                </DataTableSelectedIdsContext.Provider>
            </DataTableSortContext.Provider>
        </DataTableStoreContext.Provider>
    );
};

const emptyArray = [];

export interface DataTableBaseProps<RecordType extends RaRecord = any> {
    children: ReactNode;
    expand?:
        | ReactNode
        | FC<{
              id: Identifier;
              record: RecordType;
              resource: string;
          }>;
    expandSingle?: boolean;
    hiddenColumns?: string[];
    hasBulkActions: boolean;
    hover?: boolean;
    empty: ReactNode;
    isRowExpandable?: (record: RecordType) => boolean;
    isRowSelectable?: (record: RecordType) => boolean;
    loading: ReactNode;
    rowClick?: string | RowClickFunctionBase<RecordType> | false;
    storeKey?: string;

    // can be injected when using the component without context
    sort?: SortPayload;
    data?: RecordType[];
    isLoading?: boolean;
    isPending?: boolean;
    onSelect?: ListControllerResult['onSelect'];
    onSelectAll?: ListControllerResult['onSelectAll'];
    onToggleItem?: ListControllerResult['onToggleItem'];
    onUnselectItems?: ListControllerResult['onUnselectItems'];
    resource?: string;
    setSort?: ListControllerResult['setSort'];
    selectedIds?: Identifier[];
    total?: number;
}
