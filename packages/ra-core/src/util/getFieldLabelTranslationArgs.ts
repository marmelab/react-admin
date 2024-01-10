import inflection from 'inflection';

interface Args {
    label?: string;
    prefix?: string;
    resource?: string;
    resourceFromContext?: string;
    source?: string;
}

type TranslationArguments = [string, any?];

/**
 * Returns an array of arguments to use with the translate function for the label of a field.
 * The label will be the one specified by the label prop or one computed from the resource and source props.
 *
 * Usage:
 *  <span>
 *      {translate(...getFieldLabelTranslationArgs({ label, resource, source }))}
 *  </span>
 *
 * @see useTranslateLabel for a ready-to-use hook
 */
export default (options?: Args): TranslationArguments => {
    if (!options) return [''];

    const { label, prefix, resource, resourceFromContext, source } = options;

    if (typeof label !== 'undefined') return [label, { _: label }];

    if (typeof source === 'undefined') return [''];

    const { sourceWithoutDigits, sourceSuffix } = getSourceParts(source);

    const defaultLabel = inflection.transform(
        sourceSuffix.replace(/\./g, ' '),
        ['underscore', 'humanize']
    );

    if (resource) {
        return [
            `resources.${resource}.fields.${sourceWithoutDigits}`,
            { _: defaultLabel },
        ];
    }

    if (prefix) {
        return [`${prefix}.${sourceWithoutDigits}`, { _: defaultLabel }];
    }

    return [
        `resources.${resourceFromContext}.fields.${sourceWithoutDigits}`,
        { _: defaultLabel },
    ];
};

/**
 * Uses the source string to guess a translation message and a default label.
 *
 * @example
 * getSourceParts('pictures') // { sourceWithoutDigits: 'pictures', sourceSuffix: 'pictures' }
 * getSourceParts('pictures.url') // { sourceWithoutDigits: 'pictures.url', sourceSuffix: 'pictures.url' }
 * getSourceParts('pictures.0.url') // { sourceWithoutDigits: 'pictures.url', sourceSuffix: 'url' }
 * getSourceParts('pictures.12.urls.5.protocol') // { sourceWithoutDigits: 'pictures.urls.protocol', sourceSuffix: 'protocol' }
 */
const getSourceParts = (source: string) => {
    // remove digits, e.g. 'book.authors.2.categories.3.identifier.name' => 'book.authors.categories.identifier.name'
    const sourceWithoutDigits = source.replace(/\.\d+\./g, '.');
    // get final part, e.g. 'book.authors.2.categories.3.identifier.name' => 'identifier.name'
    // we're not using a regexp here to avoid code scanning alert "Polynomial regular expression used on uncontrolled data"
    const parts = source.split('.');
    let lastPartWithDigits;
    parts.forEach((part, index) => {
        if (onlyDigits(part)) {
            lastPartWithDigits = index;
        }
    });
    const sourceSuffix =
        lastPartWithDigits != null
            ? parts.slice(lastPartWithDigits + 1).join('.')
            : source;

    return { sourceWithoutDigits, sourceSuffix };
};

// 48 and 57 are the char codes for "0" and "9", respectively
const onlyDigits = s => {
    for (let i = s.length - 1; i >= 0; i--) {
        const d = s.charCodeAt(i);
        if (d < 48 || d > 57) return false;
    }
    return true;
};
