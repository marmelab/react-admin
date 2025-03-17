import { createContext, useContext } from 'react';
import { type SortPayload } from 'ra-core';

export const DataTableSortContext = createContext<SortPayload | undefined>(
    undefined
);

export const useDataTableSortContext = () => useContext(DataTableSortContext);
