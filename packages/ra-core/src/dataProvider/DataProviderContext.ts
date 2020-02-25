import { createContext } from 'react';

import { DataProvider } from '../types';

const DataProviderContext = createContext<Partial<DataProvider>>(null);

DataProviderContext.displayName = 'DataProviderContext';

export default DataProviderContext;
