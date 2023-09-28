import { InitOptions, i18n as I18n, TFunction } from 'i18next';
import clone from 'lodash/clone';
import { I18nProvider } from 'ra-core';
/**
 * Build a i18next-based i18nProvider.
 *
 * @example
 * TODO
 */
export default (i18nInstance: I18n, options?: InitOptions): I18nProvider => {
    let translate: TFunction;

    i18nInstance
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
            await i18nInstance.changeLanguage(newLocale);
        },
        getLocale: () => i18nInstance.language,
        getLocales: () => {
            return i18nInstance.languages
                ? i18nInstance.languages.map(l => ({ locale: l, name: l }))
                : undefined;
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
