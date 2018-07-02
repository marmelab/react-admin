import { DEFAULT_LOCALE } from './index';

/**
 * Resolve the browser locale according to the value of the global window.navigator
 *
 * Use it to determine the <Admin> locale at runtime.
 *
 * @example
 *     import React from 'react';
 *     import { Admin, Resource, resolveBrowserLocale } from 'react-admin';
 *     import englishMessages from 'ra-language-english';
 *     import frenchMessages from 'ra-language-french';
 *     const messages = {
 *        fr: frenchMessages,
 *        en: englishMessages,
 *     };
 *     const App = () => (
 *         <Admin locale={resolveBrowserLocale()} messages={messages}>
 *             ...
 *         </Admin>
 *     );
 *
 * @param {String} defaultLocale Defaults to 'en'
 */
export const resolveBrowserLocale = (defaultLocale = DEFAULT_LOCALE) => {
    // from http://blog.ksol.fr/user-locale-detection-browser-javascript/
    // Rely on the window.navigator object to determine user locale
    const { language, browserLanguage, userLanguage } = window.navigator;
    return (language || browserLanguage || userLanguage || defaultLocale).split(
        '-'
    )[0];
};
