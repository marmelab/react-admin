import { useContext } from 'react';
import DatagridContext, { DatagridContextValue } from './DatagridContext';

export const useDatagridContext = (): DatagridContextValue => {
    const context = useContext(DatagridContext);

    if (!context) {
        throw new Error(
            'useDatagridContext must be used inside a DatagridContextProvider'
        );
    }

    return context;
};
