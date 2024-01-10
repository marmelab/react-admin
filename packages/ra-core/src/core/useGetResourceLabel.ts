import inflection from 'inflection';

import { useResourceDefinitions } from './useResourceDefinitions';
import { useTranslate } from '../i18n';

/**
 * A hook which returns function to get a translated resource name. It will use the label option of the `Resource` component if it was provided.
 *
 * @returns {GetResourceLabel} A function which takes a resource name and an optional number indicating the number of items (used for pluralization) and returns a translated string.
 * @example
 * const Menu = () => {
 *     const resources = useResourceDefinitions();
 *     const getResourceLabel = useGetResourceLabel();
 *
 *     return (
 *         <ul>
 *             {Object.keys(resources).map(name => (
 *                 <li key={name}>
 *                     {getResourceLabel(name, 2)}
 *                 </li>
 *             ))}
 *         </ul>
 *     )
 * }
 */
export const useGetResourceLabel = (): GetResourceLabel => {
    const translate = useTranslate();
    const definitions = useResourceDefinitions();

    return (resource: string, count = 2): string => {
        const resourceDefinition = definitions[resource];

        const label = translate(`resources.${resource}.name`, {
            smart_count: count,
            _:
                resourceDefinition &&
                resourceDefinition.options &&
                resourceDefinition.options.label
                    ? translate(resourceDefinition.options.label, {
                          smart_count: count,
                          _: resourceDefinition.options.label,
                      })
                    : inflection.humanize(
                          count > 1
                              ? inflection.pluralize(resource)
                              : inflection.singularize(resource)
                      ),
        });

        return label;
    };
};

export type GetResourceLabel = (resource: string, count?: number) => string;
