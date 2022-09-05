import { createContext } from 'react';

import { Store } from './types';
import { memoryStore } from './memoryStore';

export const defaultStore = memoryStore();

export const StoreContext = createContext<Store>(defaultStore);
