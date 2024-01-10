import merge from 'lodash/merge';
import { DEFAULT_LOCALE } from './index';

interface AllNavigatorLanguage extends NavigatorLanguage {
    browserLanguage?: string;
    userLanguage?: string;
}

/**
 * Resolve the browser locale according to the value of the global window.navigator
 *
 * Use it to determine the <Admin> locale at runtime.
 *
 * @example
 *    import * as React from "react";
 *    import { Admin, Resource, resolveBrowserLocale } from 'react-admin';
 *    import polyglotI18nProvider from 'ra-i18n-polyglot';
 *    import englishMessages from 'ra-language-english';
 *    import frenchMessages from 'ra-language-french';
 *
 *    const messages = {
 *        fr: frenchMessages,
 *        en: englishMessages,
 *    };
 *    const i18nProvider = polyglotI18nProvider(
 *        locale => messages[locale] ? messages[locale] : messages.en,
 *        resolveBrowserLocale()
 *    );
 *
 *    const App = () => (
 *        <Admin i18nProvider={i18nProvider}>
 *            ...
 *        </Admin>
 *    );
 *
 * @param {string} defaultLocale Defaults to 'en'
 * @param options
 * @param {boolean} options.fullLocale Defaults to false
 */
export const resolveBrowserLocale = (
    defaultLocale?: string,
    options?: { fullLocale?: boolean }
): string => {
    // from http://blog.ksol.fr/user-locale-detection-browser-javascript/
    // Rely on the window.navigator object to determine user locale
    const {
        language,
        browserLanguage,
        userLanguage,
    } = window.navigator as AllNavigatorLanguage;

    const locale =
        language ||
        browserLanguage ||
        userLanguage ||
        defaultLocale ||
        DEFAULT_LOCALE;

    return options?.fullLocale ? locale : locale.split('-')[0];
};

/**
 * Compose translations from multiple packages for a single language (eg: 'english').
 *
 * Use it to merge translations from addons with the main react-admin translations.
 *
 * @example
 *     import * as React from "react";
 *     import { Admin, Resource, mergeTranslations } from 'react-admin';
 *     import polyglotI18nProvider from 'ra-i18n-polyglot';
 *     import englishMessages from 'ra-language-english';
 *     import englishTreeMessages from 'ra-tree-language-english';
 *
 *     const messages = {
 *        en: mergeTranslations(englishMessages, englishTreeMessages),
 *     };
 *     const i18nProvider = polyglotI18nProvider(
 *        locale => messages[locale] ? messages[locale] : messages.en
 *    );
 *
 *    const App = () => (
 *        <Admin i18nProvider={i18nProvider}>
 *            ...
 *        </Admin>
 *    );
 */
export const mergeTranslations = (...translationsModules: object[]) =>
    merge({}, ...translationsModules);
