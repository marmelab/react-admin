import React from 'react';
import { useTranslate } from './useTranslate';

export const Translate = ({
    i18nKey,
    args,
    children = 'no translation',
}: TranslateProps) => {
    const translate = useTranslate();
    const translatedMessage = translate(i18nKey, args);

    if (translatedMessage && translatedMessage !== i18nKey) {
        return <>{translatedMessage}</>;
    }
    return <>{children}</>;
};

export interface TranslateProps {
    i18nKey: string;
    children?: string;
    args?: Object;
}
