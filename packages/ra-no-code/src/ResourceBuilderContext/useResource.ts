import { useCallback, useMemo } from 'react';
import { ResourceDefinition, useResources } from './useResources';

type ResourceDefinitionStateActions = {
    update: (
        resourceDefinition: Partial<Omit<ResourceDefinition, 'name'>>
    ) => void;
    remove: (resource: string) => void;
};

export const useResource = (
    name: string
): [ResourceDefinition, ResourceDefinitionStateActions] => {
    const [resources, resourcesActions] = useResources();

    const update = useCallback(
        newDefinition => {
            resourcesActions.updateResource(name, newDefinition);
        },
        [resourcesActions, name]
    );

    const remove = useCallback(() => {
        resourcesActions.removeResource(name);
    }, [resourcesActions, name]);

    const actions = useMemo(() => ({ update, remove }), [update, remove]);

    return [resources[name], actions];
};
