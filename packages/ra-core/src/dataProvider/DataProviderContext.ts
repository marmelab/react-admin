import { createContext } from 'react';

import { DataProvider } from '../types';

const DataProviderContext = createContext<DataProvider>(null);

DataProviderContext.displayName = 'DataProviderContext';

export default DataProviderContext;
