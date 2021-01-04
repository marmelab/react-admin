import { useContext } from 'react';

import { TranslationContext } from './TranslationContext';

/**
 * Get the current locale from the TranslationContext
 *
 * This hook re-renders when the locale changes.
 *
 * @example
 *
 * import { useLocale } from 'react-admin';
 *
 * const availableLanguages = {
 *     en: 'English',
 *     fr: 'Français',
 * }
 * const CurrentLanguage = () => {
 *     const locale = useLocale();
 *     return <span>{availableLanguages[locale]}</span>;
 * }
 */
const useLocale = () => {
    const { locale } = useContext(TranslationContext);
    return locale;
};

export default useLocale;
