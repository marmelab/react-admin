import { useContext, useCallback } from 'react';

import { TranslationContext } from './TranslationContext';
import { Translate } from '../types';

/**
 * Translate a string using the current locale and the translations from the i18nProvider
 *
 * @see Polyglot.t()
 * @link https://airbnb.io/polyglot.js/#polyglotprototypetkey-interpolationoptions
 *
 * @return {Function} A translation function, accepting two arguments
 *   - a string used as key in the translations
 *   - an interpolationOptions object
 *
 * @example
 *
 * import { useTranslate } from 'react-admin';
 *
 * const SettingsMenu = () => {
 *     const translate = useTranslate();
 *     return <MenuItem>{translate('settings')}</MenuItem>;
 * }
 */
const useTranslate = (): Translate => {
    const { i18nProvider, locale } = useContext(TranslationContext);
    const translate = useCallback(
        (key: string, options?: any) =>
            i18nProvider.translate(key, options) as string,
        // update the hook each time the locale changes
        [i18nProvider, locale] // eslint-disable-line react-hooks/exhaustive-deps
    );
    return i18nProvider ? translate : identity;
};

const identity = key => key;

export default useTranslate;
