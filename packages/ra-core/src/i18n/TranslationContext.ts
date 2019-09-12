import { createContext } from 'react';
import { I18nProvider } from '../types';

export interface TranslationContextProps {
    locale: string;
    setLocale: (locale: string) => Promise<void>;
    i18nProvider: I18nProvider;
}

const TranslationContext = createContext<TranslationContextProps>({
    locale: 'en',
    setLocale: () => Promise.resolve(),
    i18nProvider: (type, params) => (Array.isArray(params) ? params[0] : ''),
});

TranslationContext.displayName = 'TranslationContext';

export { TranslationContext };
