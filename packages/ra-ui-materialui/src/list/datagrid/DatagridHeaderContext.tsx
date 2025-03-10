import { createContext } from 'react';

export type DatagridHeaderContextValue = {
    sort: { field: string; order: string } | undefined;
    updateSort: ((event: any) => void) | undefined;
};

export const DatagridHeaderContext = createContext<
    DatagridHeaderContextValue | undefined
>(undefined);
