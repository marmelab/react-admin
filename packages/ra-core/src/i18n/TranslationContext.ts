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
    i18nProvider: {
        translate: x => x,
        changeLocale: () => Promise.resolve(),
        getLocale: () => 'en',
    },
});

TranslationContext.displayName = 'TranslationContext';

export { TranslationContext };
