import * as React from 'react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
    ResourceConfigurationMap,
    ResourceConfiguration,
    ResourceConfigurationContext,
} from './ResourceConfigurationContext';

export const ResourceConfigurationProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [resources, setInternalResources] = useState<
        ResourceConfigurationMap
    >(() => loadConfigurationsFromLocalStorage());

    const setResources = useCallback(
        (
            value: (
                prevState: ResourceConfigurationMap
            ) => ResourceConfigurationMap
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
        (resource: ResourceConfiguration) => {
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
        (name: string, newResource: Partial<ResourceConfiguration>) => {
            setResources(current => {
                const allResources = current || {};
                const resource = allResources[name];
                if (!resource) {
                    return allResources;
                }
                const nextResources: ResourceConfigurationMap = {
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
        (name: string) => {
            setResources(current => {
                const allResources = current || {};
                const resourceToRemove = allResources[name];

                if (!resourceToRemove) {
                    return allResources;
                }
                const storedData = window.localStorage.getItem(
                    'ra-data-local-storage'
                );
                if (storedData) {
                    const { [name]: removedResource, ...data } = JSON.parse(
                        storedData
                    );
                    window.localStorage.setItem(
                        'ra-data-local-storage',
                        JSON.stringify(data)
                    );
                }

                const { [name]: currentResource, ...nextResources } = current;

                return nextResources;
            });
        },
        [setResources]
    );

    const context = useMemo(() => {
        return {
            resources,
            addResource,
            updateResource,
            removeResource,
        };
    }, [resources, addResource, updateResource, removeResource]);

    return (
        <ResourceConfigurationContext.Provider value={context}>
            {children}
        </ResourceConfigurationContext.Provider>
    );
};

export const StorageKey = '@@ra-no-code';

const loadConfigurationsFromLocalStorage = () => {
    const storedResourceDefinitions = window.localStorage.getItem(StorageKey);

    if (!storedResourceDefinitions) {
        return;
    }

    const resourceDefinitions = JSON.parse(storedResourceDefinitions);
    return resourceDefinitions;
};
