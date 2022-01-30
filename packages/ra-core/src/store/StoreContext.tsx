import { createContext } from 'react';

import { Store } from './types';
import { memoryStore } from './memoryStore';

const defaultStore = memoryStore();

export const StoreContext = createContext<Store>(defaultStore);
