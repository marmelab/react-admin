import React, { ReactElement, ReactNode } from 'react';
import DatagridContext, { DatagridContextValue } from './DatagridContext';

const DatagridContextProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: DatagridContextValue;
}): ReactElement => (
    <DatagridContext.Provider value={value}>
        {children}
    </DatagridContext.Provider>
);

export default DatagridContextProvider;
