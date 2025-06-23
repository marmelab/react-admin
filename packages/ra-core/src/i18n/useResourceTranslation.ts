import type { ReactNode } from 'react';
import { useTranslate } from './useTranslate';

export const useResourceTranslation = (
    params: UseResourceTranslationOptions
) => {
    const { resourceI18nKey, baseI18nKey, userText, options } = params;
    const translate = useTranslate();

    if (userText !== undefined) {
        if (typeof userText !== 'string') {
            return userText;
        }
        return translate(userText, { _: userText, ...options });
    }

    const translatedText = translate(resourceI18nKey, {
        ...options,
        _: translate(baseI18nKey, options),
    });

    return translatedText;
};

export interface UseResourceTranslationOptions {
    resourceI18nKey: string;
    baseI18nKey: string;
    userText?: ReactNode;
    options?: Record<string, any>;
}
