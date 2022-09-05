import { createContext } from 'react';

import { DataProvider } from '../types';

const DataProviderContext = createContext<DataProvider>(undefined!);

DataProviderContext.displayName = 'DataProviderContext';

export default DataProviderContext;
