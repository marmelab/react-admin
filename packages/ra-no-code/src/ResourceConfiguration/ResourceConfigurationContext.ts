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

export interface ReferenceFieldConfiguration extends BaseFieldConfiguration {
    type: 'reference';
    options: {
        selectionType: 'select' | 'autocomplete' | 'radio';
        referenceField: 'string';
    };
}

export interface BaseFieldConfiguration extends InferredElementDescription {
    views: FieldView[];
    options?: {
        [key: string]: any;
    };
}

export type FieldConfiguration =
    | BaseFieldConfiguration
    | ReferenceFieldConfiguration;

export type FieldView = 'list' | 'create' | 'edit' | 'show';

export type ResourceConfigurationMap =
    | {
          [key: string]: ResourceConfiguration;
      }
    | undefined;
