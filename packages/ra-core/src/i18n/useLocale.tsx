import { useLocaleState } from './useLocaleState';

/**
 * Get the current locale
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
export const useLocale = () => {
    const [locale] = useLocaleState();
    return locale;
};
