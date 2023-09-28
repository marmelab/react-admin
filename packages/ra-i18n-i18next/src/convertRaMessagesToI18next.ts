import clone from 'lodash/clone';

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

export const convertMessage = (
    message: string,
    { prefix = '{{', suffix = '}}' } = {}
) => {
    const result = message.replace(
        /%\{([a-zA-Z0-9-_]*)\}/g,
        (match, p1) => `${prefix}${p1}${suffix}`
    );

    return result;
};
