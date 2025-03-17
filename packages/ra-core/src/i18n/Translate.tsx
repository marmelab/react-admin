import React from 'react';
import { useTranslate } from './useTranslate';

export const Translate = ({
    i18nKey,
    args,
    children,
    empty = 'no translation',
    component = 'span',
}: TranslateProps) => {
    const translate = useTranslate();
    const translatedMessage = translate(i18nKey, args);

    if (translatedMessage && translatedMessage !== i18nKey) {
        return React.createElement(component, {}, translatedMessage);
    }
    if (children) {
        return React.createElement(component, {}, children);
    }
    if (empty) {
        return React.createElement(component, {}, empty);
    }
    return null;
};

export interface TranslateProps {
    i18nKey: string;
    children?: string;
    component?: React.ElementType;
    empty?: string | false;
    args?: Object;
}
