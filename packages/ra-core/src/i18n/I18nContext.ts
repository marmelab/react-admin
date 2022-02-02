import { createContext } from 'react';
import { I18nProvider } from '../types';

export type I18nContextProps = I18nProvider;

export const I18nContext = createContext<I18nProvider>({
    translate: x => x,
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
});

I18nContext.displayName = 'I18nContext';
