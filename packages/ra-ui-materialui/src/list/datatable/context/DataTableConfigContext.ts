import { type Identifier } from 'ra-core';
import { createContext, useContext, type ReactNode, type FC } from 'react';

export const DataTableConfigContext = createContext<{
    expand?:
        | ReactNode
        | FC<{
              id: Identifier;
              record: any;
              resource: string;
          }>;
    expandSingle: boolean;
    hasBulkActions: boolean;
    hover?: boolean;
}>({
    expandSingle: false,
    hover: true,
    hasBulkActions: false,
});

export const useDataTableConfigContext = () =>
    useContext(DataTableConfigContext);
