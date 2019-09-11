import { createContext } from 'react';
import { Translate, I18nProvider } from '../types';

export interface TranslationContextProps {
    provider: I18nProvider;
    locale: string;
    translate: Translate;
    setLocale: (locale: string) => void;
}

const TranslationContext = createContext<TranslationContextProps>({
    provider: () => ({}),
    locale: 'en',
    translate: id => id,
    setLocale: () => {},
});

TranslationContext.displayName = 'TranslationContext';

export { TranslationContext };
