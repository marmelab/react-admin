import { createContext, useContext } from 'react';

export const DataTableStoreContext = createContext<{
    storeKey: string;
    defaultHiddenColumns: string[];
}>({
    storeKey: '',
    defaultHiddenColumns: [],
});

export const useDataTableStoreContext = () => useContext(DataTableStoreContext);
