import inflection from 'inflection';
import { useStore } from 'react-redux';
import { getResources } from '../reducer';
import { useTranslate } from '../i18n';

/**
 * A hook which returns function to get a translated resource name. It will use the label option of the `Resource` component if it was provided.
 *
 * @returns {GetResourceLabel} A function which takes a resource name and an optional number indicating the number of items (used for pluralization) and returns a translated string.
 * @example
 * const Menu = () => {
 *     const resources = useSelector(getResources, shallowEqual);
 *     const getResourceLabel = useGetResourceLabel();
 *
 *     return (
 *         <ul>
 *             {resources.map(resource => (
 *                 <li key={resource.name}>
 *                     {getResourceLabel(resource.name, 2)}
 *                 </li>
 *             ))}
 *         </ul>
 *     )
 * }
 */
export const useGetResourceLabel = (): GetResourceLabel => {
    const store = useStore();
    const translate = useTranslate();

    return (resource: string, count = 2): string => {
        const resourceDefinition = getResources(store.getState()).find(
            r => r?.name === resource
        );

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
