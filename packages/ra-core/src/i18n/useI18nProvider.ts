import { useContext } from 'react';

import { I18nContext } from './I18nContext';

/**
 * Get the i18nProvider instance declared in the <Admin> component
 *
 * @example
 *
 * const CurrentLanguage = () => {
 *    const i18nProvider = useI18nProvider();
 *    const locale = i18nProvider.getLocale();
 *    return <span>{locale}</span>;
 * };
 */
export const useI18nProvider = () => useContext(I18nContext);
