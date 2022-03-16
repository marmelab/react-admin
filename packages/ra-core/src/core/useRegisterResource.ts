import { useCallback, useContext } from 'react';

import { ResourceDefinitionContext } from './ResourceDefinitionContext';
import { ResourceDefinition } from '../types';

export const useRegisterResource = () => {
    const [, setResourceConfiguration] = useContext(ResourceDefinitionContext);

    const registerResource = useCallback(
        (...resources: ResourceDefinition[]) => {
            resources.forEach(resource => {
                setResourceConfiguration(resource);
            });
        },
        [setResourceConfiguration]
    );

    return registerResource;
};
