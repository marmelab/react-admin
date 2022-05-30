import { useMemo } from 'react';
import { useI18nProvider } from './useI18nProvider';

/**
 * A hook that gets the available locales from the i18nProvider.
 * @example
 *
 * import { useLocales } from 'react-admin';
 *
 * const LocaleSelector = () => {
 *     const locales = useLocales();
 *     const [currentLocale, setCurrentLocale] = useLocaleState();
 *
 *     return (
 *         <select onChange={event => setCurrentLocale(event.target.value)}>
 *             {locales.map(locale => (
 *                 <option key={locale.locale} value={locale.locale}>
 *                     {locale.name}
 *                 </option>
 *             )}
 *         </select>
 *     );
 * }
 */
export const useLocales = (options?: UseLocalesOptions) => {
    const i18nProvider = useI18nProvider();
    const locales = useMemo(
        () => (i18nProvider?.getLocales ? i18nProvider?.getLocales() : []),
        [i18nProvider]
    );
    return options?.locales ?? locales;
};

export interface UseLocalesOptions {
    locales?: { locale: string; name: string }[];
}
