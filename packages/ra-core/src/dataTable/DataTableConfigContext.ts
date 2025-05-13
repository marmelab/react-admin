import { createContext, useContext, type ReactNode, type FC } from 'react';
import { type Identifier } from '../types';

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
