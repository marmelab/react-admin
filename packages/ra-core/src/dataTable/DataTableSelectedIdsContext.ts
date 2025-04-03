import { createContext, useContext } from 'react';
import { type Identifier } from '../types';

export const DataTableSelectedIdsContext = createContext<
    Identifier[] | undefined
>(undefined);

export const useDataTableSelectedIdsContext = () =>
    useContext(DataTableSelectedIdsContext);
