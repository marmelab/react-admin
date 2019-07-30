import { createContext } from 'react';

import { DataProvider } from '../types';

const DataProviderContext = createContext<DataProvider>(null);

export default DataProviderContext;
