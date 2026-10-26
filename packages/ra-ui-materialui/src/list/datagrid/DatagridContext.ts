import { createContext } from 'react';
import { RaRecord } from 'ra-core';

const DatagridContext = createContext<DatagridContextValue>({});

DatagridContext.displayName = 'DatagridContext';

export type DatagridContextValue = {
    isRowExpandable?: (record: RaRecord) => boolean;
    expandSingle?: boolean;
    rowClickDescriptionId?: string;
};

export default DatagridContext;
