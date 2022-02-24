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
 *
 * @deprecated use useLocaleState instead
 */
export const useLocale = () => {
    const [locale] = useLocaleState();
    return locale;
};
