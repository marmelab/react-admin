import { useCallback, useMemo } from 'react';
import { ResourceConfiguration } from './ResourceConfigurationContext';
import { useResourceConfigurations } from './useResourceConfigurations';

type ResourceDefinitionStateActions = {
    update: (
        resourceDefinition: Partial<Omit<ResourceConfiguration, 'name'>>
    ) => void;
    remove: (resource: string) => void;
};

export const useResourceConfiguration = (
    name: string
): [ResourceConfiguration, ResourceDefinitionStateActions] => {
    const resourceConfigurations = useResourceConfigurations();

    const update = useCallback(
        newDefinition => {
            resourceConfigurations.updateResource(name, newDefinition);
        },
        [resourceConfigurations, name]
    );

    const remove = useCallback(() => {
        resourceConfigurations.removeResource(name);
    }, [resourceConfigurations, name]);

    const actions = useMemo(() => ({ update, remove }), [update, remove]);
    const resource = useMemo(() => resourceConfigurations.resources[name], [
        resourceConfigurations,
        name,
    ]);

    return [resource, actions];
};
