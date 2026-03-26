import React, { isValidElement, ReactElement, ReactNode } from 'react';
import { useTranslate } from './useTranslate';

const SPLIT_MARKER = '#@RA_CORE_INTERNAL_SPLIT@#';

export const Translate = ({ i18nKey, options, children }: TranslateProps) => {
    const translate = useTranslate();

    // Separate React element values from plain values
    const elementMap: Record<string, ReactElement> = {};
    const sanitizedOptions: Record<string, any> = {};
    let placeholderIndex = 0;

    if (options) {
        for (const [key, value] of Object.entries(options)) {
            if (isValidElement(value)) {
                const placeholder = `TRANSLATION_PLACEHOLDER_${placeholderIndex++}`;
                elementMap[placeholder] = value;
                sanitizedOptions[key] =
                    `${SPLIT_MARKER}${placeholder}${SPLIT_MARKER}`;
            } else {
                sanitizedOptions[key] = value;
            }
        }
    }

    const translateOptions =
        typeof children === 'string'
            ? { _: children, ...sanitizedOptions }
            : sanitizedOptions;

    const translatedMessage = translate(i18nKey, translateOptions);

    if (!translatedMessage) {
        return children;
    }

    // If no elements were extracted, return plain string
    if (placeholderIndex === 0) {
        return <>{translatedMessage}</>;
    }

    // Split the translated string and replace placeholders with React elements
    const parts = translatedMessage.split(SPLIT_MARKER);
    return (
        <>
            {/* After splitting by SPLIT_MARKER, even indices are text and odd indices are placeholders */}
            {parts.map((part, index) =>
                index % 2 === 1 ? (
                    <React.Fragment key={index}>
                        {elementMap[part]}
                    </React.Fragment>
                ) : (
                    <React.Fragment key={index}>{part}</React.Fragment>
                )
            )}
        </>
    );
};

export interface TranslateProps {
    i18nKey: string;
    children?: ReactNode;
    options?: Record<string, any>;
}
