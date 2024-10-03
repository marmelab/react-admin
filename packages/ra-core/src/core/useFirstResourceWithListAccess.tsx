import { useCanAccessResources } from '../auth/useCanAccessResources';
import { useAuthenticated } from '../auth';
import { useResourceDefinitions } from './useResourceDefinitions';

/**
 * A hook that returns the first resource for which users have access to the list page.
 * It calls the `authProvider.canAccess` if available to check the permissions.
 */
export const useFirstResourceWithListAccess = () => {
    const { isPending: isPendingAuthenticated } = useAuthenticated();
    const resources = useResourceDefinitions();
    const resourcesNames = Object.keys(resources).filter(
        resource => resources[resource].hasList
    );

    const { canAccess, isPending } = useCanAccessResources({
        action: 'list',
        resources: resourcesNames,
        enabled: !isPendingAuthenticated,
    });

    const firstResourceWithListAccess = resourcesNames.find(
        resource => canAccess && canAccess[resource] === true
    );

    return { resource: firstResourceWithListAccess, isPending };
};
