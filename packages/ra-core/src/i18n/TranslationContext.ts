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
    i18nProvider: (type, params: { key: string; options?: Object }) =>
        params && params.key ? params.key : '',
});

TranslationContext.displayName = 'TranslationContext';

export { TranslationContext };
