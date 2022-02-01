import { useLocaleState } from './useLocaleState';

/**
 * Set the current locale in the I18nContext and re-render the app when the locale changes.
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
 *
 * @deprecated use useLocaleState instead
 */
export const useSetLocale = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setLocale] = useLocaleState();
    return setLocale;
};
