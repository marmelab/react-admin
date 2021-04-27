import { createContext } from 'react';
import { useResources } from './useResources';

export const ResourceBuilderContext = createContext<
    ResourceBuilderContextValue
>([
    {},
    {
        addResource: () => {},
        updateResource: () => {},
        removeResource: () => {},
        setResources: () => {},
    },
]);

export type ResourceBuilderContextValue = ReturnType<typeof useResources>;
