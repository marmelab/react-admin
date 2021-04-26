import { useEffect, useMemo, useState } from 'react';

type ResourceDefinition = {
    name: string;
    label?: string;
};

type ResourceDefinitionState = ResourceDefinition[] | undefined;

type ResourceDefinitionStateActions = {
    addResource: (resourceDefinition: ResourceDefinition) => void;
    updateResource: (
        name: string,
        resourceDefinition: Partial<Omit<ResourceDefinition, 'name'>>
    ) => void;
    removeResource: (resourceDefinition: ResourceDefinition) => void;
    setResources: (
        value: (prevState: ResourceDefinitionState) => ResourceDefinitionState
    ) => void;
};
const storageKey = '@@ra-no-code.resources';

export const useResources = (): [
    ResourceDefinitionState,
    ResourceDefinitionStateActions
] => {
    const [resources, setInternalResources] = useState<ResourceDefinition[]>();

    useEffect(() => {
        const storedResourceDefinitions = window.localStorage.getItem(
            storageKey
        );

        if (!storedResourceDefinitions) {
            return;
        }

        const resourceDefinitions = JSON.parse(storedResourceDefinitions);
        setInternalResources(resourceDefinitions);
    }, []);

    const actions = useMemo(() => {
        const setResources = (
            value: (
                prevState: ResourceDefinitionState
            ) => ResourceDefinitionState
        ) => {
            setInternalResources(prevState => {
                const newState = value(prevState);

                if (newState != undefined) {
                    window.localStorage.setItem(
                        storageKey,
                        JSON.stringify(newState)
                    );
                } else {
                    window.localStorage.removeItem(storageKey);
                }
                return newState;
            });
        };
        return {
            addResource: (resource: ResourceDefinition) => {
                setResources(current => {
                    const allResources = current || [];
                    if (allResources.some(r => r.name === resource.name)) {
                        return allResources;
                    }
                    return [...(current || []), resource];
                });
            },
            updateResource: (
                name: string,
                newResource: Partial<ResourceDefinition>
            ) => {
                setResources(current => {
                    const allResources = current || [];
                    const resource = allResources.find(r => r.name === name);
                    if (!resource) {
                        return allResources;
                    }
                    const nextResources = [
                        ...allResources.slice(
                            0,
                            allResources.indexOf(resource)
                        ),
                        { ...resource, ...newResource },
                        ...allResources.slice(
                            allResources.indexOf(resource) + 1
                        ),
                    ];
                    return nextResources;
                });
            },
            removeResource: (resource: ResourceDefinition) => {
                setResources(current => {
                    const allResources = current || [];
                    const index = allResources.findIndex(
                        r => r.name === resource.name
                    );
                    if (index < 0) {
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

                    const nextResources = [
                        ...allResources.slice(0, index),
                        ...allResources.slice(index + 1),
                    ];

                    return nextResources.length > 0 ? nextResources : undefined;
                });
            },
            setResources,
        };
    }, []);

    return [resources, actions];
};
