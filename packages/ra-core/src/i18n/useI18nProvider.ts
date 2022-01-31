import { useContext } from 'react';

import { I18nContext } from './I18nContext';

export const useI18nProvider = () => useContext(I18nContext);
