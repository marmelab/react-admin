import { useCallback, useContext } from 'react';

import { ResourceDefinitionContext } from './ResourceDefinitionContext';
import { ResourceDefinition } from '../types';

/**
 * Register one or more resources.
 *
 * @example // single parameter
 * const registerResource = useRegisterResource();
 * registerResource({
 *     name: 'posts',
 *     options: {},
 *     hasList: true,
 *     hasEdit: true,
 *     hasShow: true,
 *     hasCreate: true,
 *     icon: <PostIcon />,
 * });
 *
 * @example // register several resources at once
 * const registerResource = useRegisterResource();
 * registerResource(resourceDef1, resourceDef2, resourceDef3);
 */
export const useRegisterResource = () => {
    const { setDefinition } = useContext(ResourceDefinitionContext);

    const registerResources = useCallback(
        (...resources: ResourceDefinition[]) => {
            resources.forEach(resource => {
                setDefinition(resource);
            });
        },
        [setDefinition]
    );

    return registerResources;
};
