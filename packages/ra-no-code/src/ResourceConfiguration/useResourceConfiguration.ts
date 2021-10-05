import { useCallback, useMemo } from 'react';
import { ResourceConfiguration } from './ResourceConfigurationContext';
import { useResourcesConfiguration } from './useResourcesConfiguration';

/**
 * This hook returns a tuple containing the resource configuration as its first element,
 * and an object providing helper functions to manipulate it as its second element.
 * @param name The resource to look for.
 *
 * @example
 * const [resource, helpers] = useResourceConfiguration('customers');
 * console.log(resource); // { name: 'customers', label: 'Customers', fields: [] };
 *
 * helpers.update({ label: 'Clients' });
 * helpers.remove();
 * @returns {[ResourceConfiguration, ResourceDefinitionStateActions]}
 */
export const useResourceConfiguration = (
    name: string
): [ResourceConfiguration, ResourceDefinitionStateActions] => {
    const [resources, helpers] = useResourcesConfiguration();

    const update = useCallback(
        newDefinition => {
            helpers.updateResource(name, newDefinition);
        },
        [helpers, name]
    );

    const remove = useCallback(() => {
        helpers.removeResource(name);
    }, [helpers, name]);

    const context = useMemo<
        [ResourceConfiguration, ResourceDefinitionStateActions]
    >(() => [resources[name], { update, remove }], [
        name,
        remove,
        resources,
        update,
    ]);

    return context;
};

type ResourceDefinitionStateActions = {
    update: (
        resourceDefinition: Partial<Omit<ResourceConfiguration, 'name'>>
    ) => void;
    remove: (resource: string) => void;
};
