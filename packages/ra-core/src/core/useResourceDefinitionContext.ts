import { useContext } from 'react';

import { ResourceDefinitionContext } from './ResourceDefinitionContext';

export const useResourceDefinitionContext = () =>
    useContext(ResourceDefinitionContext);
