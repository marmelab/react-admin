import { type SortPayload, type Identifier } from 'ra-core';
import { type SxProps } from '@mui/material';
import { createContext, useContext, type ReactNode, type FC } from 'react';
import { type RowClickFunction } from '../types';

export const DataTableContext = createContext<{
    data?: any[];
    expand?:
        | ReactNode
        | FC<{
              id: Identifier;
              record: any;
              resource: string;
          }>;
    expandSingle: boolean;
    handleSort?: (event: any) => void;
    handleToggleItem: (id: Identifier, event: any) => void;
    hasBulkActions: boolean;
    hover?: boolean;
    isRowExpandable?: (record: any) => boolean;
    isRowSelectable?: (record: any) => boolean;
    onSelect: ((ids: Identifier[]) => void) | undefined;
    rowClick?: string | RowClickFunction | false;
    rowSx?: (record: any, index: number) => SxProps;
    selectedIds: Identifier[] | undefined;
    setSort: ((sort: SortPayload) => void) | undefined;
    sort: SortPayload | undefined;
    storeKey: string;
}>({
    expandSingle: false,
    handleToggleItem: () => {},
    hover: true,
    hasBulkActions: false,
    onSelect: () => {},
    selectedIds: [],
    setSort: () => {},
    sort: { field: 'id', order: 'ASC' },
    storeKey: '',
});

export const useDataTableContext = () => useContext(DataTableContext);
