import React, {
    useEffect,
    useRef,
    useCallback,
    useMemo,
    Children,
    ReactElement,
    FunctionComponent,
} from 'react';

import { useSafeSetState } from '../util/hooks';
import { TranslationContext } from './TranslationContext';
import { useUpdateLoading } from '../loading';
import { useNotify } from '../sideEffect';
import { I18N_CHANGE_LOCALE, I18nProvider } from '../types';

interface Props {
    locale?: string;
    i18nProvider: I18nProvider;
    children: ReactElement<any>;
}

/**
 * Creates a translation context, available to its children
 *
 * @example
 *     const MyApp = () => (
 *         <Provider store={store}>
 *             <TranslationProvider locale="fr" i18nProvider={i18nProvider}>
 *                 <!-- Child components go here -->
 *             </TranslationProvider>
 *         </Provider>
 *     );
 */
const TranslationProvider: FunctionComponent<Props> = props => {
    const { i18nProvider, children, locale = 'en' } = props;
    const { startLoading, stopLoading } = useUpdateLoading();
    const notify = useNotify();

    const [state, setState] = useSafeSetState({
        locale,
        i18nProvider,
    });

    const setLocale = useCallback(
        (newLocale: string) =>
            new Promise(resolve => {
                startLoading();
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(i18nProvider(I18N_CHANGE_LOCALE, newLocale));
            })
                .then(() => {
                    stopLoading();
                    setState({
                        locale: newLocale,
                        i18nProvider,
                    });
                })
                .catch(error => {
                    stopLoading();
                    notify('ra.notification.i18n_error', 'warning');
                    console.error(error);
                }),
        [i18nProvider, notify, setState, startLoading, stopLoading]
    );

    // handle update with different locale
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setLocale(locale);
        }
    }, [setLocale, locale]);

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
