import { useState, useMemo } from 'react';
import { useResourceContext } from '../core';
import { TranslatableContextValue } from './TranslatableContext';
import { useLocaleState } from './useLocaleState';
import { useTranslateLabel } from './useTranslateLabel';

/**
 * Hook supplying the logic to translate a field value in multiple languages.
 *
 * @param options The hook options
 * @param {string} options.defaultLocale The locale of the default selected locale. Defaults to 'en'.
 * @param {string[]} options.locales An array of the supported locales. Each is an object with a locale and a name property. For example { locale: 'en', name: 'English' }.
 *
 * @returns
 * An object with following properties and methods:
 * - selectedLocale: The locale of the currently selected locale
 * - locales: An array of the supported locales
 * - getLabel: A function which returns the translated label for the given field
 * - getSource: A function which returns the source for the given field
 * - selectLocale: A function which set the selected locale
 */
export const useTranslatable = (
    options: UseTranslatableOptions
): TranslatableContextValue => {
    const [localeFromUI] = useLocaleState();
    const { defaultLocale = localeFromUI, locales } = options;
    const [selectedLocale, setSelectedLocale] = useState(defaultLocale);
    const resource = useResourceContext({});
    const translateLabel = useTranslateLabel();

    const context = useMemo<TranslatableContextValue>(
        () => ({
            getSource: (source: string, locale: string = selectedLocale) =>
                `${source}.${locale}`,
            getLabel: (source: string, label?: string) =>
                translateLabel({ source, resource, label }) as string,
            locales,
            selectedLocale,
            selectLocale: setSelectedLocale,
        }),
        [locales, resource, selectedLocale, translateLabel]
    );

    return context;
};

export type UseTranslatableOptions = {
    defaultLocale?: string;
    locales: string[];
};
