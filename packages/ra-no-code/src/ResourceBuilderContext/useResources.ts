import { InferredElementDescription } from 'ra-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StorageKey } from '../constants';

type ResourceDefinition = {
    name: string;
    label?: string;
    fields?: InferredElementDescription[];
};

type ResourceDefinitionMap =
    | {
          [key: string]: ResourceDefinition;
      }
    | undefined;

type ResourceDefinitionStateActions = {
    addResource: (resourceDefinition: ResourceDefinition) => void;
    updateResource: (
        name: string,
        resourceDefinition: Partial<Omit<ResourceDefinition, 'name'>>
    ) => void;
    removeResource: (resourceDefinition: ResourceDefinition) => void;
    setResources: (
        value: (prevState: ResourceDefinitionMap) => ResourceDefinitionMap
    ) => void;
};
export const useResources = (): [
    ResourceDefinitionMap,
    ResourceDefinitionStateActions
] => {
    const [resources, setInternalResources] = useState<ResourceDefinitionMap>(
        {}
    );

    useEffect(() => {
        const storedResourceDefinitions = window.localStorage.getItem(
            StorageKey
        );

        if (!storedResourceDefinitions) {
            return;
        }

        const resourceDefinitions = JSON.parse(storedResourceDefinitions);
        setInternalResources(resourceDefinitions);
    }, []);

    const setResources = useCallback(
        (
            value: (prevState: ResourceDefinitionMap) => ResourceDefinitionMap
        ) => {
            setInternalResources(prevState => {
                const newState = value(prevState);

            if (newState != undefined) { // eslint-disable-line
                    window.localStorage.setItem(
                        StorageKey,
                        JSON.stringify(newState)
                    );
                } else {
                    window.localStorage.removeItem(StorageKey);
                }
                return newState;
            });
        },
        []
    );

    const addResource = useCallback(
        (resource: ResourceDefinition) => {
            setResources(current => {
                const allResources = current || {};
                if (allResources[resource.name]) {
                    return allResources;
                }
                return {
                    ...current,
                    [resource.name]: resource,
                };
            });
        },
        [setResources]
    );

    const updateResource = useCallback(
        (name: string, newResource: Partial<ResourceDefinition>) => {
            setResources(current => {
                const allResources = current || {};
                const resource = allResources[name];
                if (!resource) {
                    return allResources;
                }
                const nextResources: ResourceDefinitionMap = {
                    ...current,
                    [name]: {
                        ...current[name],
                        ...newResource,
                    },
                };
                return nextResources;
            });
        },
        [setResources]
    );

    const removeResource = useCallback(
        (resource: ResourceDefinition) => {
            setResources(current => {
                const allResources = current || {};
                const resourceToRemove = allResources[resource.name];

                if (!resourceToRemove) {
                    return allResources;
                }
                const storedData = window.localStorage.getItem(
                    'ra-data-local-storage'
                );
                if (storedData) {
                    const {
                        [resource.name]: removedResource,
                        ...data
                    } = JSON.parse(storedData);
                    window.localStorage.setItem(
                        'ra-data-local-storage',
                        JSON.stringify(data)
                    );
                }

                const {
                    [resource.name]: currentResource,
                    ...nextResources
                } = current;

                return nextResources;
            });
        },
        [setResources]
    );

    const actions = useMemo(() => {
        return {
            addResource,
            updateResource,
            removeResource,
            setResources,
        };
    }, [addResource, updateResource, removeResource, setResources]);

    return [resources, actions];
};
