import * as React from 'react';
import {
    useEffect,
    useMemo,
    useRef,
    type ComponentType,
    type ReactNode,
} from 'react';
import {
    OptionalResourceContextProvider,
    useEvent,
    useListContextWithProps,
    useResourceContext,
    type Identifier,
    type RaRecord,
    type SortPayload,
} from 'ra-core';
import union from 'lodash/union';
import difference from 'lodash/difference';

import { type RowClickFunction } from '../types';
import {
    DataTableCallbacksContext,
    DataTableDataContext,
    DataTableSelectedIdsContext,
    DataTableSortContext,
    DataTableStoreContext,
} from './context';

const DefaultEmpty = () => null;
const DefaultLoading = () => null;

export const DataTableBase = (props: DataTableBaseProps) => {
    const resourceFromContext = useResourceContext(props);
    const {
        children,
        empty = DefaultEmpty,
        loading: Loading = DefaultLoading,
        hiddenColumns = emptyArray,
        isRowSelectable,
        isRowExpandable,
        resource,
        rowClick,
        rowSx,
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

    const callbacksContextValue = useMemo(
        () => ({
            handleSort: setSort ? handleSort : undefined,
            handleToggleItem,
            isRowExpandable,
            isRowSelectable,
            onSelect,
            rowClick,
            rowSx,
        }),
        [
            setSort,
            handleSort,
            handleToggleItem,
            isRowExpandable,
            isRowSelectable,
            onSelect,
            rowClick,
            rowSx,
        ]
    );

    if (isPending === true) {
        return <Loading />;
    }

    /**
     * Once loaded, the data for the list may be empty. Instead of
     * displaying the table header with zero data rows,
     * the DataTable displays the empty component.
     */
    if (data == null || data.length === 0 || total === 0) {
        if (empty) {
            return empty;
        }

        return null;
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
                        <OptionalResourceContextProvider value={resource}>
                            <DataTableDataContext.Provider value={data}>
                                {children}
                            </DataTableDataContext.Provider>
                        </OptionalResourceContextProvider>
                    </DataTableCallbacksContext.Provider>
                </DataTableSelectedIdsContext.Provider>
            </DataTableSortContext.Provider>
        </DataTableStoreContext.Provider>
    );
};

const emptyArray = [];

export interface DataTableBaseProps<RecordType extends RaRecord = any> {
    body?: ComponentType;
    children: ReactNode;
    footer?: ComponentType;
    header?: ComponentType;
    hiddenColumns?: string[];
    empty?: ReactNode;
    loading?: ComponentType;
    isRowExpandable?: (record: RecordType) => boolean;
    isRowSelectable?: (record: RecordType) => boolean;
    rowClick?: string | RowClickFunction | false;
    rowSx?: (record: RecordType, index: number) => any;
    storeKey?: string;

    // can be injected when using the component without context
    resource?: string;
    sort?: SortPayload;
    data?: RecordType[];
    isLoading?: boolean;
    isPending?: boolean;
    onSelect?: (ids: Identifier[]) => void;
    onToggleItem?: (id: Identifier) => void;
    setSort?: (sort: SortPayload) => void;
    selectedIds?: Identifier[];
    total?: number;
}

DataTableBase.displayName = 'DataTableBase';
