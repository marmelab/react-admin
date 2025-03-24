import React, { ReactNode } from 'react';
import { useTranslate } from './useTranslate';

export const Translate = ({ i18nKey, options, children }: TranslateProps) => {
    const translate = useTranslate();
    const translatedMessage = translate(
        i18nKey,
        typeof children === 'string' ? { _: children, ...options } : options
    );

    if (translatedMessage) {
        return <>{translatedMessage}</>;
    }
    return children;
};

export interface TranslateProps {
    i18nKey: string;
    children?: ReactNode;
    options?: Object;
}
