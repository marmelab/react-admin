import { useContext } from 'react';
import DatagridContext, { DatagridContextValue } from './DatagridContext';

export const useDatagridContext = (): DatagridContextValue => {
    const context = useContext(DatagridContext);
    return context;
};
