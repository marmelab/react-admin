import { createContext } from 'react';

import { PreferenceProvider } from './types';
import { memoryPreferenceProvider } from './memoryPreferenceProvider';

const defaultPreferenceProvider = memoryPreferenceProvider();

export const PreferenceContext = createContext<PreferenceProvider>(
    defaultPreferenceProvider
);
