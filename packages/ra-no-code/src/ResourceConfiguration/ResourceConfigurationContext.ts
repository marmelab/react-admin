import { InferredElementDescription } from 'ra-core';
import { createContext } from 'react';

export const ResourceConfigurationContext = createContext<
    ResourceConfigurationContextValue
>([
    {},
    {
        addResource: () => {},
        updateResource: () => {},
        removeResource: () => {},
    },
]);

export type ResourceConfigurationContextValue = [
    ResourceConfigurationMap,
    ResourceConfigurationContextHelpers
];

export type ResourceConfigurationContextHelpers = {
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
    fields?: FieldConfiguration[];
};

export interface FieldConfiguration extends InferredElementDescription {
    views: FieldView[];
}

export type FieldView = 'list' | 'create' | 'edit' | 'show';

export type ResourceConfigurationMap =
    | {
          [key: string]: ResourceConfiguration;
      }
    | undefined;
