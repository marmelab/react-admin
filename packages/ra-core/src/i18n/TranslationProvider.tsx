import React, { useCallback, useMemo, Children, ReactNode } from 'react';

import { useSafeSetState } from '../util/hooks';
import { TranslationContext } from './TranslationContext';
import { I18nProvider } from '../types';

export interface TranslationProviderProps {
    locale?: string;
    i18nProvider: I18nProvider;
    children: ReactNode;
}

interface State {
    locale: string; // this time it's required
    i18nProvider: I18nProvider;
}

/**
 * Creates a translation context, available to its children
 *
 * @example
 *     const MyApp = () => (
 *         <Provider store={store}>
 *             <TranslationProvider i18nProvider={i18nProvider}>
 *                 <!-- Child components go here -->
 *             </TranslationProvider>
 *         </Provider>
 *     );
 */
const TranslationProvider = (props: TranslationProviderProps) => {
    const { i18nProvider, children } = props;

    const [state, setState] = useSafeSetState<State>({
        locale: i18nProvider ? i18nProvider.getLocale() : 'en',
        i18nProvider,
    });

    const setLocale = useCallback(
        (newLocale: string) =>
            setState(state => ({ ...state, locale: newLocale })),
        [setState]
    );

    // Allow locale modification by including setLocale in the context
    // This can't be done in the initial state because setState doesn't exist yet
    const value = useMemo(
        () => ({
            ...state,
            setLocale,
        }),
        [setLocale, state]
    );

    return (
        <TranslationContext.Provider value={value}>
            {Children.only(children)}
        </TranslationContext.Provider>
    );
};

export default TranslationProvider;
