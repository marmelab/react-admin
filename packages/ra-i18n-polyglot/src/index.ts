import Polyglot from 'node-polyglot';

import { I18nProvider } from 'ra-core';

type GetMessages = (locale: string) => Object;

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
 * const i18nProvider = polyglotI18nProvider(locale => messages[locale])
 */
export default (
    getMessages: GetMessages,
    initialLocale: string = 'en',
    polyglotOptions: any = {}
): I18nProvider => {
    let locale = initialLocale;
    const messages = getMessages(initialLocale);
    if (messages instanceof Promise) {
        throw new Error(
            `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`
        );
    }
    const polyglot = new Polyglot({
        locale,
        phrases: { '': '', ...messages },
        ...polyglotOptions,
    });
    let translate = polyglot.t.bind(polyglot);

    return {
        translate: (key: string, options: any = {}) => translate(key, options),
        changeLocale: (newLocale: string) =>
            new Promise(resolve =>
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(getMessages(newLocale as string))
            ).then((messages: Object) => {
                locale = newLocale;
                const newPolyglot = new Polyglot({
                    locale: newLocale,
                    phrases: { '': '', ...messages },
                    ...polyglotOptions,
                });
                translate = newPolyglot.t.bind(newPolyglot);
            }),
        getLocale: () => locale,
    };
};
