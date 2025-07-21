import { createContext, useContext } from 'react';

export const DataTableColumnFilterContext = createContext<string | undefined>(
    undefined
);

export const useDataTableColumnFilterContext = () =>
    useContext(DataTableColumnFilterContext);
