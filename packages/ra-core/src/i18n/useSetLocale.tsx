import { useContext } from 'react';

import { TranslationContext } from './TranslationContext';

/**
 * Set the current locale using the TranslationContext
 *
 * This hook rerenders when the locale changes.
 *
 * @param {string} locale
 *
 * @example
 *
 * import { useLocale } from 'react-admin';
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
const useSetLocale = () => {
    const { setLocale } = useContext(TranslationContext);
    return setLocale;
};

export default useSetLocale;
