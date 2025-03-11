import { createContext } from 'react';

export type DataTableHeaderContextValue = {
    sort: { field: string; order: string } | undefined;
    updateSort: ((event: any) => void) | undefined;
};

export const DataTableHeaderContext = createContext<
    DataTableHeaderContextValue | undefined
>(undefined);
