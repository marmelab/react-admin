import React from 'react';
import { useTranslate } from './useTranslate';

export const Translate = ({
    i18nKey,
    args,
    children,
    empty = 'no translation',
}: TranslateProps) => {
    const translate = useTranslate();
    const translatedMessage = translate(i18nKey, args);

    if (translatedMessage && translatedMessage !== i18nKey) {
        return <>{translatedMessage}</>;
    }
    if (children) {
        return <>{children}</>;
    }
    if (empty) {
        return <>{empty}</>;
    }
    return null;
};

export interface TranslateProps {
    i18nKey: string;
    children?: string;
    empty?: string | false;
    args?: Object;
}
