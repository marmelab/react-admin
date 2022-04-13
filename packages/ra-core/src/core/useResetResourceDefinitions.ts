import { useContext } from 'react';

import { ResourceDefinitionContext } from './ResourceDefinitionContext';

export const useResetResourceDefinitions = () => {
    const { reset } = useContext(ResourceDefinitionContext);
    return reset;
};
