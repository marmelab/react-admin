import { DEFAULT_LOCALE } from './index';

export const resolveBrowserLocale = () => {
    // from http://blog.ksol.fr/user-locale-detection-browser-javascript/
    // Rely on the window.navigator object to determine user locale
    const { language, browserLanguage, userLanguage } = window.navigator;
    return (language || browserLanguage || userLanguage || DEFAULT_LOCALE).split('-')[0];
};
