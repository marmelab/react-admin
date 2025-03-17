import { createContext, useContext } from 'react';

export const DataTableDataContext = createContext<any[] | undefined>(undefined);

export const useDataTableDataContext = () => useContext(DataTableDataContext);
