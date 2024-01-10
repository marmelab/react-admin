import { useMemo } from 'react';
import { useI18nProvider } from './useI18nProvider';
import { useStore } from '../store/useStore';

/**
 * Get the current locale and the ability to change it
 *
 * @example
 *
 * import { useLocaleState } from 'react-admin';
 *
 * const availableLanguages = {
 *     en: 'English',
 *     fr: 'Français',
 * }
 * const LocaleSwitcher = () => {
 *     const [locale, setLocale] = useLocaleState();
 *     return (
 *         <div>
 *             <div>Language</div>
 *             <Button disabled={locale === 'fr'} onClick={() => setLocale('fr')}>
 *                 English
 *             </Button>
 *             <Button disabled={locale === 'en'} onClick={() => setLocale('en')}>
 *                 French
 *             </Button>
 *         </div>
 *     );
 * };
 */
export const useLocaleState = () => {
    const i18nProvider = useI18nProvider();
    const defaultLocale = useMemo(() => i18nProvider.getLocale(), [
        i18nProvider,
    ]);
    return useStore<string>('locale', defaultLocale);
};
