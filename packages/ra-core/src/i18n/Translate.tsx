import React, { ReactNode } from 'react';
import { useTranslate } from './useTranslate';

export const Translate = ({ i18nKey, args, children }: TranslateProps) => {
    const translate = useTranslate();
    const translatedMessage = translate(
        i18nKey,
        typeof children === 'string' ? { _: children, ...args } : args
    );

    if (translatedMessage) {
        return <>{translatedMessage}</>;
    }
    if (children) {
        return <>{children}</>;
    }
    return null;
};

export interface TranslateProps {
    i18nKey: string;
    children?: ReactNode;
    args?: Object;
}
