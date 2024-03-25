import { createContext } from 'react';

import { DataProvider } from '../types';

const DataProviderContext = createContext<DataProvider | null>(null);

DataProviderContext.displayName = 'DataProviderContext';

export default DataProviderContext;
