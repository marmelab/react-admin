import { useContext } from 'react';

import { ResourceDefinitionContext } from './ResourceDefinitionContext';
import { ResourceDefinition } from '../types';

export const useRegisterResource = () => {
    const [, setResourceConfiguration] = useContext(ResourceDefinitionContext);

    return (...resources: ResourceDefinition[]) => {
        resources.forEach(resource => {
            setResourceConfiguration(resource);
        });
    };
};
