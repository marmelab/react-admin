'use client';
import Polyglot from 'node-polyglot';

import { I18nProvider, TranslationMessages, Locale } from 'ra-core';

type GetMessages = (
    locale: string
) => TranslationMessages | Promise<TranslationMessages>;

/**
 * Build a polyglot-based i18nProvider based on a function returning the messages for a locale
 *
 * @example
 *
 * import { Admin, Resource, polyglotI18nProvider } from 'react-admin';
 * import englishMessages from 'ra-language-english';
 * import frenchMessages from 'ra-language-french';
 *
 * const messages = {
 *     fr: frenchMessages,
 *     en: englishMessages,
 * };
 * const i18nProvider = polyglotI18nProvider(
 *     locale => messages[locale],
 *     'en',
 *     [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'Français' }]
 * )
 */
export default (
    getMessages: GetMessages,
    initialLocale: string = 'en',
    availableLocales: Locale[] | any = [{ locale: 'en', name: 'English' }],
    polyglotOptions: any = {}
): I18nProvider => {
    let locale = initialLocale;
    const messages = getMessages(initialLocale);
    if (messages instanceof Promise) {
        throw new Error(
            `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`
        );
    }

    let availableLocalesFinal, polyglotOptionsFinal;
    if (Array.isArray(availableLocales)) {
        // third argument is an array of locales
        availableLocalesFinal = availableLocales;
        polyglotOptionsFinal = polyglotOptions;
    } else {
        // third argument is the polyglotOptions
        availableLocalesFinal = [{ locale: 'en', name: 'English' }];
        polyglotOptionsFinal = availableLocales;
    }
    const polyglot = new Polyglot({
        locale,
        phrases: { '': '', ...messages },
        ...polyglotOptionsFinal,
    });
    let translate = polyglot.t.bind(polyglot);

    return {
        translate: (key: string, options: any = {}) => translate(key, options),
        changeLocale: (newLocale: string) =>
            // We systematically return a Promise for the messages because
            // getMessages may return a Promise
            Promise.resolve(getMessages(newLocale as string)).then(
                (messages: TranslationMessages) => {
                    locale = newLocale;
                    const newPolyglot = new Polyglot({
                        locale: newLocale,
                        phrases: { '': '', ...messages },
                        ...polyglotOptions,
                    });
                    translate = newPolyglot.t.bind(newPolyglot);
                }
            ),
        getLocale: () => locale,
        getLocales: () => availableLocalesFinal,
    };
};
