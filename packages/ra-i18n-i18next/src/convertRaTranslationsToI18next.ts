import clone from 'lodash/clone';

/**
 * A function that takes translations from a standard react-admin language package and converts them to i18next format.
 * It transforms the following:
 * - interpolations wrappers from `%{foo}` to `{{foo}}` unless a prefix and/or a suffix are provided
 * - pluralization messages from a single key containing text like `"key": "foo |||| bar"` to multiple keys `"foo_one": "foo"` and `"foo_other": "bar"`
 * @param raMessages The translations to convert. This is an object as found in packages such as ra-language-english.
 * @param options Options to customize the conversion.
 * @param options.prefix The prefix to use for interpolation variables. Defaults to `{{`.
 * @param options.suffix The suffix to use for interpolation variables. Defaults to `}}`.
 * @returns The converted translations as an object.
 *
 * @example Convert the english translations from ra-language-english to i18next format
 * import englishMessages from 'ra-language-english';
 * import { convertRaMessagesToI18next } from 'ra-i18n-18next';
 *
 * const messages = convertRaMessagesToI18next(englishMessages);
 *
 * @example Convert the english translations from ra-language-english to i18next format with custom interpolation wrappers
 * import englishMessages from 'ra-language-english';
 * import { convertRaMessagesToI18next } from 'ra-i18n-18next';
 *
 * const messages = convertRaMessagesToI18next(englishMessages, {
 *    prefix: '#{',
 *   suffix: '}#',
 * });
 */
export const convertRaTranslationsToI18next = (
    raMessages: object,
    { prefix = '{{', suffix = '}}' } = {}
) => {
    return Object.keys(raMessages).reduce((acc, key) => {
        if (typeof acc[key] === 'object') {
            acc[key] = convertRaTranslationsToI18next(acc[key], {
                prefix,
                suffix,
            });
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
            acc[`${key}_one`] = convertRaTranslationToI18next(
                pluralVariants[0],
                {
                    prefix,
                    suffix,
                }
            );
            acc[`${key}_other`] = convertRaTranslationToI18next(
                pluralVariants[1],
                {
                    prefix,
                    suffix,
                }
            );
            delete acc[key];
        } else {
            acc[key] = convertRaTranslationToI18next(message, {
                prefix,
                suffix,
            });
        }

        return acc;
    }, clone(raMessages));
};

/**
 * A function that takes a single translation text from a standard react-admin language package and converts it to i18next format.
 * It transforms the interpolations wrappers from `%{foo}` to `{{foo}}` unless a prefix and/or a suffix are provided
 *
 * @param translationText The translation text to convert.
 * @param options Options to customize the conversion.
 * @param options.prefix The prefix to use for interpolation variables. Defaults to `{{`.
 * @param options.suffix The suffix to use for interpolation variables. Defaults to `}}`.
 * @returns The converted translation text.
 *
 * @example Convert a single message to i18next format
 * import { convertRaTranslationToI18next } from 'ra-i18n-18next';
 *
 * const messages = convertRaTranslationToI18next("Hello %{name}!");
 * // "Hello {{name}}!"
 *
 * @example Convert the english translations from ra-language-english to i18next format with custom interpolation wrappers
 * import englishMessages from 'ra-language-english';
 * import { convertRaTranslationToI18next } from 'ra-i18n-18next';
 *
 * const messages = convertRaTranslationToI18next("Hello %{name}!", {
 *    prefix: '#{',
 *   suffix: '}#',
 * });
 * // "Hello #{name}#!"
 */
export const convertRaTranslationToI18next = (
    translationText: string,
    { prefix = '{{', suffix = '}}' } = {}
) => {
    const result = translationText.replace(
        /%\{([a-zA-Z0-9-_]*)\}/g,
        (match, p1) => `${prefix}${p1}${suffix}`
    );

    return result;
};
