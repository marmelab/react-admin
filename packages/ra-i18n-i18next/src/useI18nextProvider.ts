import { useEffect, useRef, useState } from 'react';
import { createInstance, InitOptions, i18n as I18n, TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nProvider, Locale } from 'ra-core';

/**
 * A hook that returns an i18nProvider for react-admin applications, based on i18next.
 * You can provide your own i18next instance but don't initialize it, the hook will do it for you with the options you may provide.
 * Besides, this hook already adds the `initReactI18next` plugin to i18next.
 *
 * @example Basic usage
 * import { Admin } from 'react-admin';
 * import { useI18nextProvider } from 'ra-i18n-i18next';
 *
 * const App = () => {
 *     const i18nProvider = useI18nextProvider();
 *     if (!i18nProvider) return (<div>Loading...</div>);
 *
 *     return (
 *         <Admin i18nProvider={i18nProvider}>
 *            ...
 *         </Admin>
 *     );
 * };
 *
 * @example With a custom i18next instance and options
 * import { Admin } from 'react-admin';
 * import { useI18nextProvider } from 'ra-i18n-i18next';
 * import i18n from 'i18next';
 * import Backend from 'i18next-http-backend';
 * import LanguageDetector from 'i18next-browser-languagedetector';
 *
 * const App = () => {
 *     const i18nextInstance = i18n
 *         .use(Backend)
 *         .use(LanguageDetector);
 *
 *     const i18nProvider = useI18nextProvider({
 *         i18nInstance: i18nextInstance,
 *         options: {
 *             fallbackLng: 'en',
 *             debug: true,
 *             interpolation: {
 *                 escapeValue: false, // not needed for react!!
 *             },
 *         }
 *     });
 *
 *     if (!i18nProvider) return (<div>Loading...</div>);
 *
 *     return (
 *         <Admin i18nProvider={i18nProvider}>
 *            ...
 *         </Admin>
 *     );
 * };
 */
export const useI18nextProvider = ({
    i18nInstance = createInstance(),
    options = {},
    availableLocales = [{ locale: 'en', name: 'English' }],
}: {
    i18nInstance?: I18n;
    options?: InitOptions;
    availableLocales?: Locale[];
} = {}) => {
    const [i18nProvider, setI18nProvider] = useState<I18nProvider>(null);
    const initializationPromise = useRef<Promise<I18nProvider>>(null);

    useEffect(() => {
        if (initializationPromise.current) {
            return;
        }

        initializationPromise.current = getI18nProvider(
            i18nInstance,
            options,
            availableLocales
        ).then(provider => {
            setI18nProvider(provider);
            return provider;
        });
    }, [availableLocales, i18nInstance, options]);

    return i18nProvider;
};

export const getI18nProvider = async (
    i18nInstance: I18n,
    options?: InitOptions,
    availableLocales: Locale[] = [{ locale: 'en', name: 'English' }]
): Promise<I18nProvider> => {
    let translate: TFunction;

    await i18nInstance
        .use(initReactI18next)
        .init({
            lng: 'en',
            fallbackLng: 'en',
            react: { useSuspense: false },
            ...options,
        })
        .then(t => {
            translate = t;
        });

    return {
        translate: (key: string, options: any = {}) => {
            const { _: defaultValue, smart_count: count, ...otherOptions } =
                options || {};
            return translate(key, {
                defaultValue,
                count,
                ...otherOptions,
            }).toString();
        },
        changeLocale: async (newLocale: string) => {
            await i18nInstance.loadLanguages(newLocale);
            const t = await i18nInstance.changeLanguage(newLocale);
            translate = t;
        },
        getLocale: () => i18nInstance.language,
        getLocales: () => {
            return availableLocales;
        },
    };
};
