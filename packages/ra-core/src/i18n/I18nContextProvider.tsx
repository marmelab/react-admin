import * as React from 'react';
import { useEffect, useState, ReactNode } from 'react';

import { I18nContext } from './I18nContext';
import { useStore } from '../store/useStore';
import { useNotify } from '../notification';
import { I18nProvider } from '../types';

/**
 * Store the i18nProvider in a context, and rerender children when the locale changes
 */
export const I18nContextProvider = ({
    value = defaulti18nContext,
    children,
}: I18nContextProviderProps) => {
    const [locale] = useStore('locale');
    const notify = useNotify();
    const [key, setKey] = useState(0);
    // to avoid blinking effect, delay first render if the user has a non-default locale
    const [isInitialized, setInitialized] = useState(
        locale === value.getLocale()
    );

    // watch store for locale changes
    useEffect(() => {
        if (locale && value.getLocale() !== locale) {
            new Promise(resolve => {
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(value.changeLocale(locale));
            })
                .then(() => {
                    // Force full page re-render.
                    // This is slow on locale change, but it's a good way
                    // to avoid having one subscription to the locale
                    // for each call to translate()
                    setKey(key => key + 1);
                    setInitialized(true);
                })
                .catch(error => {
                    setInitialized(true);
                    notify('ra.notification.i18n_error', { type: 'error' });
                    console.error(error);
                });
        } else {
            setInitialized(true);
        }
    }, [value, locale, notify]);

    return isInitialized ? (
        <I18nContext.Provider value={value} key={key}>
            {children}
        </I18nContext.Provider>
    ) : null;
};

export interface I18nContextProviderProps {
    value?: I18nProvider;
    children: ReactNode;
}

const defaulti18nContext = {
    translate: x => x,
    changeLocale: () => Promise.resolve(),
    getLocale: () => 'en',
};
