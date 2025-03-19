import React from 'react';
import { useTranslate } from './useTranslate';

export const Translate = ({ i18nKey, args, children }: TranslateProps) => {
    const translate = useTranslate();
    const translatedMessage = translate(i18nKey, { _: children, ...args });

    if (translatedMessage) {
        return <>{translatedMessage}</>;
    }
    return null;
};

export interface TranslateProps {
    i18nKey: string;
    children?: string;
    args?: Object;
}
