import { useContext, useCallback } from 'react';

import { TranslationContext } from './TranslationContext';
import { useUpdateLoading } from '../loading';
import { useNotify } from '../sideEffect';

/**
 * Set the current locale using the TranslationContext
 *
 * This hook re-renders when the locale changes.
 *
 * @example
 *
 * import { useSetLocale } from 'react-admin';
 *
 * const availableLanguages = {
 *     en: 'English',
 *     fr: 'Français',
 * }
 * const LanguageSwitcher = () => {
 *     const setLocale = useSetLocale();
 *     return (
 *         <ul>{
 *             Object.keys(availableLanguages).map(locale => {
 *                  <li key={locale} onClick={() => setLocale(locale)}>
 *                      {availableLanguages[locale]}
 *                  </li>
 *              })
 *         }</ul>
 *     );
 * }
 */
const useSetLocale = (): SetLocale => {
    const { setLocale, i18nProvider } = useContext(TranslationContext);
    const { startLoading, stopLoading } = useUpdateLoading();
    const notify = useNotify();
    return useCallback(
        (newLocale: string) =>
            new Promise(resolve => {
                startLoading();
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(i18nProvider.changeLocale(newLocale));
            })
                .then(() => {
                    stopLoading();
                    setLocale(newLocale);
                })
                .catch(error => {
                    stopLoading();
                    notify('ra.notification.i18n_error', { type: 'warning' });
                    console.error(error);
                }),
        [i18nProvider, notify, setLocale, startLoading, stopLoading]
    );
};

type SetLocale = (locale: String) => Promise<void>;

export default useSetLocale;
