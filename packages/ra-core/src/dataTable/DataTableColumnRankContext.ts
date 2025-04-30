import { createContext, useContext } from 'react';

export const DataTableColumnRankContext = createContext<number | undefined>(
    undefined
);

export const useDataTableColumnRankContext = () =>
    useContext(DataTableColumnRankContext);
