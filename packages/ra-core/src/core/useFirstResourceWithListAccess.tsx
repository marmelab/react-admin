import { ReactElement } from 'react';
import { useCanAccessResources } from '../auth/useCanAccessResources';

/**
 * A hook that returns the first resource users have list access to.
 * It calls the `authProvider.canAccess` if available to check the permissions.
 */
export const useFirstResourceWithListAccess = (resources: ReactElement[]) => {
    const resourcesNames = resources.map(resource => resource.props.name);
    const { canAccess, isPending } = useCanAccessResources({
        action: 'list',
        resources: resourcesNames,
    });

    const firstResourceWithListAccess = resourcesNames.find(
        resource => canAccess && canAccess[resource] === true
    );

    return { resource: firstResourceWithListAccess, isPending };
};
