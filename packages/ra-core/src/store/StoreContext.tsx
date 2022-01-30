import { createContext } from 'react';

import { StoreProvider } from './types';
import { memoryStore } from './memoryStore';

const defaultStoreProvider = memoryStore();

export const StoreContext = createContext<StoreProvider>(defaultStoreProvider);
