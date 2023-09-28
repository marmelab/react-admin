import { InitOptions, i18n as I18n, TFunction } from 'i18next';
import clone from 'lodash/clone';
import { I18nProvider, Locale } from 'ra-core';
import { useEffect, useRef, useState } from 'react';
/**
 * Build a i18next-based i18nProvider.
 *
 * @example
 * TODO
 */
export const useI18nextProvider = (
    i18nInstance: I18n,
    options?: InitOptions,
    availableLocales: Locale[] = [{ locale: 'en', name: 'English' }]
) => {
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
    }, []);

    return i18nProvider;
};

export const getI18nProvider = async (
    i18nInstance: I18n,
    options?: InitOptions,
    availableLocales: Locale[] = [{ locale: 'en', name: 'English' }]
): Promise<I18nProvider> => {
    let translate: TFunction;

    await i18nInstance
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

export const convertRaMessagesToI18next = (
    raMessages,
    { prefix = '{{', suffix = '}}' } = {}
) => {
    return Object.keys(raMessages).reduce((acc, key) => {
        if (typeof acc[key] === 'object') {
            acc[key] = convertRaMessagesToI18next(acc[key], { prefix, suffix });
            return acc;
        }

        const message = acc[key] as string;

        if (message.indexOf(' |||| ') > -1) {
            const pluralVariants = message.split(' |||| ');

            if (
                pluralVariants.length > 2 &&
                process.env.NODE_ENV === 'development'
            ) {
                console.warn(
                    'A message contains more than two plural forms so we can not convert it to i18next format automatically. You should provide your own translations for this language.'
                );
            }
            acc[`${key}_one`] = convertMessage(pluralVariants[0], {
                prefix,
                suffix,
            });
            acc[`${key}_other`] = convertMessage(pluralVariants[1], {
                prefix,
                suffix,
            });
            delete acc[key];
        } else {
            acc[key] = convertMessage(message, { prefix, suffix });
        }

        return acc;
    }, clone(raMessages));
};

const convertMessage = (
    message: string,
    { prefix = '{{', suffix = '}}' } = {}
) => {
    const result = message.replace(
        /%\{([a-zA-Z0-9-_]*)\}/g,
        (match, p1) => `${prefix}${p1}${suffix}`
    );

    return result;
};
