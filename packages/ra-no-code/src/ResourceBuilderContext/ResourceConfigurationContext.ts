import { createContext } from 'react';
import { InferredElementDescription } from 'ra-core';

export const ResourceConfigurationContext = createContext<
    ResourceConfigurationContextValue
>({
    resources: {},
    addResource: () => {},
    updateResource: () => {},
    removeResource: () => {},
});

export type ResourceConfigurationContextValue = {
    resources: ResourceConfigurationMap;
    addResource: (resourceDefinition: ResourceConfiguration) => void;
    updateResource: (
        name: string,
        resourceDefinition: Partial<Omit<ResourceConfiguration, 'name'>>
    ) => void;
    removeResource: (name: string) => void;
};

export type ResourceConfiguration = {
    name: string;
    label?: string;
    fields?: InferredElementDescription[];
};

export type ResourceConfigurationMap =
    | {
          [key: string]: ResourceConfiguration;
      }
    | undefined;
