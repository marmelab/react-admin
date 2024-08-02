import { useState, useMemo } from 'react';
import set from 'lodash/set';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { TranslatableContextValue } from './TranslatableContext';
import { useLocaleState } from './useLocaleState';

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

    const context = useMemo<TranslatableContextValue>(
        () => ({
            locales,
            selectedLocale,
            selectLocale: setSelectedLocale,
            getRecordForLocale,
        }),
        [locales, selectedLocale]
    );

    return context;
};

export type UseTranslatableOptions = {
    defaultLocale?: string;
    locales: string[];
};

/**
 * Returns a record where translatable fields have their values set to the value of the given locale.
 * This is necessary because the fields rely on the RecordContext to get their values and have no knowledge of the locale.
 *
 * Given the record { title: { en: 'title_en', fr: 'title_fr' } } and the locale 'fr',
 * the record for the locale 'fr' will be { title: 'title_fr' }
 */
export const getRecordForLocale = (record: {} | undefined, locale: string) => {
    if (!record) {
        return record;
    }
    // Get all paths of the record
    const paths = getRecordPaths(record);

    // For each path, if a path ends with the locale, set the value of the path without the locale
    // to the value of the path with the locale
    const recordForLocale = paths.reduce((acc, path) => {
        if (path.includes(locale)) {
            const pathWithoutLocale = path.slice(0, -1);
            const value = get(record, path);
            return set(acc, pathWithoutLocale, value);
        }
        return acc;
    }, cloneDeep(record));

    return recordForLocale;
};

// Return all the possible paths of the record as an array of arrays
// For example, given the record
//     {
//         title: { en: 'title_en', fr: 'title_fr' },
//         items: [
//             { description: { en: 'item1_en', fr: 'item1_fr' } },
//             { description: { en: 'item2_en', fr: 'item2_fr' } }
//         ]
//     },
// the paths will be
//     [
//         ['title'],
//         ['title', 'en'],
//         ['title', 'fr'],
//         ['items'],
//         ['items', '0'],
//         ['items', '0', 'description'],
//         ['items', '0', 'description', 'en'],
//         ['items', '0', 'description', 'fr'],
//         ['items', '1'],
//         ['items', '1', 'description'],
//         ['items', '1', 'description', 'en'],
//         ['items', '1', 'description', 'fr']]
const getRecordPaths = (
    record: any = {},
    path: Array<string> = []
): Array<Array<string>> => {
    return Object.entries(record).reduce((acc, [key, value]) => {
        if (value !== null && typeof value === 'object') {
            return [
                ...acc,
                [...path, key],
                ...getRecordPaths(value, [...path, key]),
            ];
        }
        if (Array.isArray(value)) {
            return value.reduce(
                (acc, item, index) => [
                    ...acc,
                    ...getRecordPaths(item, [...path, key, `${index}`]),
                ],
                acc
            );
        }
        return [...acc, [...path, key]];
    }, []);
};
