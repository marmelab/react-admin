import { GET_LOCALE_MESSAGES, GET_DEFAULT_MESSAGES } from './i18nActions';

/**
 * A factory for messagesProvider to allow multiple languages in react-admin
 * @param {Object} messageBundles
 * @param {Object} defaultMessageBundle
 * @return {function} messagesProvider
 */
export const createMessagesProvider = (
    messageBundles = {},
    defaultMessageBundle = null
) => (type, locale) => {
    switch (type) {
        case GET_DEFAULT_MESSAGES:
            return defaultMessageBundle;
        case GET_LOCALE_MESSAGES:
            return messageBundles[locale]
                ? typeof messageBundles[locale] === 'function'
                  ? messageBundles[locale]()
                  : messageBundles[locale]
                : Promise.reject(`Locale ${locale} is not supported`);
        default:
            throw new Error(`Undefined i18nProvider action type ${type}`);
    }
};
export default createMessagesProvider();
