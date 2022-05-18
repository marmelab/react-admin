import inflection from 'inflection';

import { useResourceContext } from '../core/useResourceContext';
import { useTitlePrefix } from './useTitlePrefix';

interface Args {
    label?: string;
    resource?: string;
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
 */
export default (options?: Args): TranslationArguments => {
    if (!options) return [''];

    const { label, resource, source } = options;

    const prefix = useTitlePrefix();
    const resourceFromContext = useResourceContext();

    if (typeof label !== 'undefined') return [label, { _: label }];

    if (typeof source !== 'undefined') {
        // source may be composed, e.g. 'author.name', or 'pictures.0.url' in ArrayInput
        const sourceSuffix = source.split('.').pop();
        const defaultLabel = inflection.transform(sourceSuffix, [
            'underscore',
            'humanize',
        ]);
        if (!resource) {
            if (prefix) {
                return [`${prefix}.${sourceSuffix}`, { _: defaultLabel }];
            } else {
                return [
                    `resources.${resourceFromContext}.fields.${sourceSuffix}`,
                    { _: defaultLabel },
                ];
            }
        } else {
            return [
                `resources.${resource}.fields.${sourceSuffix}`,
                { _: defaultLabel },
            ];
        }
    }

    return [''];
};
