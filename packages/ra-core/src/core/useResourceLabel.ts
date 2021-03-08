import inflection from 'inflection';
import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { useTranslate } from '../i18n';

/**
 * A hook which will return a translated resource name. It will use the label option of the `Resource` component if provided.
 *
 * @param resource The resource name
 * @param pluralize A boolean indicating whether the resource label should be pluralized.
 * @param lowFirstLetter A boolean indicating whether the first letter of the resource label should be lower cased.
 */
export const useResourceLabel = (
    resource: string,
    pluralize = true
): string => {
    const resources = useSelector(getResources);
    const resourceDefinition = resources.find(r => r?.name === resource);

    const translate = useTranslate();

    const label = translate(`resources.${resource}.name`, {
        smart_count: pluralize ? 2 : 1,
        _:
            resourceDefinition &&
            resourceDefinition.options &&
            resourceDefinition.options.label
                ? translate(resourceDefinition.options.label, {
                      smart_count: pluralize ? 2 : 1,
                      _: resourceDefinition.options.label,
                  })
                : inflection.humanize(
                      pluralize
                          ? inflection.pluralize(resource)
                          : inflection.singularize(resource)
                  ),
    });

    return label;
};
