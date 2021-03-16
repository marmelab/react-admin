import inflection from 'inflection';
import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { useTranslate } from '../i18n';

/**
 * A hook which returns function to get a translated resource name. It will use the label option of the `Resource` component if it was provided.
 *
 * @returns {GetResourceLabel} A function which takes a resource name and an optional boolean indicating whether to pluralize the name and returns a translated string.
 * @example
 * const Menu = () => {
 *     const resources = useSelector(getResources, shallowEqual);
 *     const getResourceLabel = useGetResourceLabel();
 *
 *     return (
 *         <ul>
 *             {resources.map(resource => (
 *                 <li key={resource.name}>
 *                     {getResourceLabel(resource.name, true)}
 *                 </li>
 *             ))}
 *         </ul>
 *     )
 * }
 */
export const useGetResourceLabel = (): GetResourceLabel => {
    const resources = useSelector(getResources);
    const translate = useTranslate();

    return (resource: string, pluralize = true): string => {
        const resourceDefinition = resources.find(r => r?.name === resource);

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
};

export type GetResourceLabel = (
    resource: string,
    pluralize?: boolean
) => string;
