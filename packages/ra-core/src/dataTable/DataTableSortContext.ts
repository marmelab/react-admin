import { createContext, useContext } from 'react';
import { type SortPayload } from '../types';

export const DataTableSortContext = createContext<SortPayload | undefined>(
    undefined
);

export const useDataTableSortContext = () => useContext(DataTableSortContext);
