import { useMemo } from 'react';
import { ResourceContextValue } from './ResourceContext';
import { useResources } from './useResources';

export const useGetResource = (name: string): ResourceContextValue => {
    const resources = useResources();

    const resource = useMemo(() => {
        const referenceResource = resources.find(r => r.name === name);

        if (!referenceResource) {
            console.warn(
                `Resource ${name} is not registered. Have you forgotten to add a <Resource name="${name} /> for it?`
            );
        }

        const { name: resource, ...rest } = referenceResource;

        return {
            resource,
            ...rest,
        };
    }, [resources, name]);

    return resource;
};
