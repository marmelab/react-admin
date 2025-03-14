import React from 'react';
import { useTranslate } from './useTranslate';

// story: test with i18next
// story: test with polyglot

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
        return <span>{empty}</span>;
    }
    return null;
};

export interface TranslateProps {
    i18nKey: string;
    component?: React.ElementType;
    children?: string;
    empty?: string | false;
    args?: { [key: string]: string };
}
