import { useContext } from 'react';

import { PreferenceContext } from './PreferenceContext';

/**
 * Get the preferenceProvider stored in the PreferenceContext
 */
export const usePreferenceProvider = () => useContext(PreferenceContext);
