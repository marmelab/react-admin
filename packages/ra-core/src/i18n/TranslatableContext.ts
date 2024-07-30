import { createContext } from 'react';

export const TranslatableContext = createContext<
    TranslatableContextValue | undefined
>(undefined);

export interface TranslatableContextValue {
    locales: string[];
    selectedLocale: string;
    selectLocale: SelectTranslatableLocale;
    getRecordForLocale: GetRecordForLocale;
}

export type SelectTranslatableLocale = (locale: string) => void;

/**
 * Returns a record where translatable fields have their values set to the value of the given locale.
 * This is necessary because the fields rely on the RecordContext to get their values and have no knowledge of the locale.
 *
 * Given the record { title: { en: 'title_en', fr: 'title_fr' } } and the locale 'fr',
 * the record for the locale 'fr' will be { title: 'title_fr' }
 */
export type GetRecordForLocale = (record: any, locale: string) => any;
