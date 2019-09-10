import React, {
    useEffect,
    useRef,
    useCallback,
    useMemo,
    Children,
    ReactElement,
    FunctionComponent,
} from 'react';
import Polyglot from 'node-polyglot';
import defaultMessages from 'ra-language-english';
import defaultsDeep from 'lodash/defaultsDeep';

import { useSafeSetState } from '../util/hooks';
import { I18nProvider } from '../types';
import { TranslationContext } from './TranslationContext';

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

    const [state, setState] = useSafeSetState({
        provider: i18nProvider,
        locale,
        translate: (() => {
            const messages = i18nProvider(locale);
            if (messages instanceof Promise) {
                throw new Error(
                    `The i18nProvider returned a Promise for the messages of the default locale (${locale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`
                );
            }
            const polyglot = new Polyglot({
                locale,
                phrases: defaultsDeep({ '': '' }, messages, defaultMessages),
            });
            return polyglot.t.bind(polyglot);
        })(),
    });

    const setLocale = useCallback(
        newLocale =>
            new Promise(resolve =>
                // so we systematically return a Promise for the messages
                // i18nProvider may return a Promise for language changes,
                resolve(i18nProvider(newLocale))
            ).then(messages => {
                const polyglot = new Polyglot({
                    locale: newLocale,
                    phrases: defaultsDeep(
                        { '': '' },
                        messages,
                        defaultMessages
                    ),
                });
                setState({
                    provider: i18nProvider,
                    locale: newLocale,
                    translate: polyglot.t.bind(polyglot),
                });
            }),
        [i18nProvider, setState]
    );

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
