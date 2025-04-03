import { type Identifier } from 'ra-core';
import { type SxProps } from '@mui/material';
import { createContext, useContext } from 'react';
import { type RowClickFunction } from '../../types';

export const DataTableCallbacksContext = createContext<{
    handleSort?: (event: any) => void;
    handleToggleItem?: (id: Identifier, event: any) => void;
    isRowExpandable?: (record: any) => boolean;
    isRowSelectable?: (record: any) => boolean;
    onSelect?: ((ids: Identifier[]) => void) | undefined;
    rowClick?: string | RowClickFunction | false;
}>({});

export const useDataTableCallbacksContext = () =>
    useContext(DataTableCallbacksContext);
