import { useMemo } from 'react';
import { useI18nProvider } from './useI18nProvider';
import { useStore } from '../store/useStore';

/**
 * Get the current locale from the I18nContext
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
export const useLocale = () => {
    const i18nProvider = useI18nProvider();
    const defaultLocale = useMemo(() => i18nProvider.getLocale(), [
        i18nProvider,
    ]);
    const [locale] = useStore<string>('locale', defaultLocale);
    return locale;
};
