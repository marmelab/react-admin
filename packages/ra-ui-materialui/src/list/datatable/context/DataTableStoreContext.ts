import { createContext, useContext } from 'react';

export const DataTableStoreContext = createContext<string>('');

export const useDataTableStoreContext = () => useContext(DataTableStoreContext);
