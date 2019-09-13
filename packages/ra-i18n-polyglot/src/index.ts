import Polyglot from 'node-polyglot';

import { I18N_TRANSLATE, I18N_CHANGE_LOCALE, I18nProvider } from 'ra-core';

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
    const messages = getMessages(initialLocale);
    if (messages instanceof Promise) {
        throw new Error(
            `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`
        );
    }
    const polyglot = new Polyglot({
        locale: initialLocale,
        phrases: { '': '', ...messages },
        ...polyglotOptions,
    });
    let translate = polyglot.t.bind(polyglot);

    return (type, params) => {
        if (type === I18N_TRANSLATE) {
            const { key, options = {} } = params as {
                key: string;
                options?: Object;
            };
            return translate.call(null, key, options);
        }
        if (type === I18N_CHANGE_LOCALE) {
            return new Promise(resolve => {
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(getMessages(params as string));
            }).then(messages => {
                const newPolyglot = new Polyglot({
                    locale: params,
                    phrases: { '': '', ...messages },
                    ...polyglotOptions,
                });
                translate = newPolyglot.t.bind(newPolyglot);
            });
        }
    };
};
