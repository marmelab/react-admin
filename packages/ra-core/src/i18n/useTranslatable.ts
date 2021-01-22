import { useState, useMemo } from 'react';
import { useResourceContext } from '../core';
import { getFieldLabelTranslationArgs } from '../util';
import { TranslatableContextValue } from './TranslatableContext';
import useTranslate from './useTranslate';

/**
 * Hook supplying the logic to translate a field value in multiple languages.
 *
 * @param options The hook options
 * @param {string} options.defaultLanguage The locale of the default selected language. Defaults to 'en'.
 * @param {Language[]} options.languages An array of the supported languages. Each is an object with a locale and a name property. For example { locale: 'en', name: 'English' }.
 *
 * @returns
 * An object with following properties and methods:
 * - selectedLanguage: The locale of the currently selected language
 * - languages: An array of the supported languages
 * - getLabelInput: A function which returns the translated label for the given field
 * - getSource: A function which returns the source for the given field
 * - selectLanguage: A function which set the selected language
 */
export const useTranslatable = (
    options: UseTranslatableOptions
): TranslatableContextValue => {
    const { defaultLanguage = 'en', languages } = options;
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
    const resource = useResourceContext({});
    const translate = useTranslate();

    const context = useMemo<TranslatableContextValue>(
        () => ({
            getSource: (source: string, locale: string = selectedLanguage) =>
                `${source}.${locale}`,
            getLabel: (source: string) => {
                return translate(
                    ...getFieldLabelTranslationArgs({
                        source,
                        resource,
                        label: undefined,
                    })
                );
            },
            languages,
            selectedLanguage,
            selectLanguage: setSelectedLanguage,
        }),
        [languages, resource, selectedLanguage, translate]
    );

    return context;
};

export type UseTranslatableOptions = {
    defaultLanguage?: string;
    languages: string[];
};
