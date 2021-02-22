import { createContext } from 'react';
import { Record as RaRecord } from 'ra-core';

const DatagridContext = createContext<DatagridContextValue>(undefined);

DatagridContext.displayName = 'DatagridContext';

export type DatagridContextValue = {
    isRowExpandable?: (record: RaRecord) => boolean;
};

export default DatagridContext;
