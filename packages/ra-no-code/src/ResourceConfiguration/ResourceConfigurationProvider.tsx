import * as React from 'react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { DataProvider } from 'ra-core';
import {
    ResourceConfigurationMap,
    ResourceConfiguration,
    ResourceConfigurationContext,
    ResourceConfigurationContextValue,
} from './ResourceConfigurationContext';

export const ResourceConfigurationProvider = ({
    children,
    dataProvider,
    storageKey = STORAGE_KEY,
}: ResourceConfigurationProviderProps) => {
    const [resources, setInternalResources] = useState<
        ResourceConfigurationMap
    >(() => loadConfigurationsFromLocalStorage(storageKey));

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
                        storageKey,
                        JSON.stringify(newState)
                    );
                } else {
                    window.localStorage.removeItem(storageKey);
                }
                return newState;
            });
        },
        [storageKey]
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

                deleteResourceData(name, dataProvider);

                const { [name]: currentResource, ...nextResources } = current;

                return nextResources;
            });
        },
        [dataProvider, setResources]
    );

    const context = useMemo<ResourceConfigurationContextValue>(() => {
        return [
            resources,
            {
                addResource,
                updateResource,
                removeResource,
            },
        ];
    }, [resources, addResource, updateResource, removeResource]);

    return (
        <ResourceConfigurationContext.Provider value={context}>
            {children}
        </ResourceConfigurationContext.Provider>
    );
};

export const STORAGE_KEY = '@@ra-no-code';

export interface ResourceConfigurationProviderProps {
    children: ReactNode;
    dataProvider: DataProvider;
    storageKey?: string;
}

const loadConfigurationsFromLocalStorage = storageKey => {
    const storedResourceDefinitions = window.localStorage.getItem(storageKey);

    if (!storedResourceDefinitions) {
        return {};
    }

    const resourceDefinitions = JSON.parse(storedResourceDefinitions);
    return resourceDefinitions;
};

const deleteResourceData = async (
    resource: string,
    dataProvider: DataProvider,
    numberOfRecordsToDelete = 10000
) => {
    const { data, total } = await dataProvider.getList(resource, {
        pagination: { page: 1, perPage: numberOfRecordsToDelete },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
    });
    await dataProvider.deleteMany(resource, {
        ids: data.map(({ id }) => id),
    });

    if (total > numberOfRecordsToDelete) {
        return deleteResourceData(
            resource,
            dataProvider,
            numberOfRecordsToDelete
        );
    }
};
