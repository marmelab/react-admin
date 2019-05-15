import { createContext } from 'react';
import { Translate } from '../types';

export interface TranslationContextProps {
    locale: string;
    translate: Translate;
}

export const TranslationContext = createContext<TranslationContextProps>({
    locale: 'en',
    translate: id => id,
});
