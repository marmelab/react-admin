import { createContext, useContext } from 'react';
import { type SxProps } from '@mui/material';

export type DatabaseRowSxContextType =
    | ((record: any, index: number) => SxProps)
    | undefined;

export const DataTableRowSxContext =
    createContext<DatabaseRowSxContextType>(undefined);

export const useDataTableRowSxContext = () => useContext(DataTableRowSxContext);
