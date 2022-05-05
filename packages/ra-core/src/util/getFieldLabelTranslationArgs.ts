import inflection from 'inflection';

interface Args {
    label?: string;
    labelArgs?: Record<string, any>;
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
    if (!options) {
        return [''];
    }

    const { label, labelArgs, resource, source } = options;
    return typeof label !== 'undefined'
        ? [label, { _: label, ...labelArgs }]
        : typeof source !== 'undefined'
        ? [
              `resources.${resource}.fields.${source}`,
              {
                  _: inflection.transform(source, ['underscore', 'humanize']),
                  ...labelArgs,
              },
          ]
        : [''];
};
