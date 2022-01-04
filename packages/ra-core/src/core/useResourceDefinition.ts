import { useMemo } from 'react';
import defaults from 'lodash/defaults';

import { useResourceDefinitions } from './useResourceDefinitions';
import { useResourceContext } from './useResourceContext';
import { ResourceDefinition } from '../types';

/**
 * Hook which returns the definition of the requested resource
 */
export const useResourceDefinition = (
    props?: UseResourceDefinitionOptions
): ResourceDefinition => {
    const resource = useResourceContext(props);
    const resourceDefinitions = useResourceDefinitions();
    const { hasCreate, hasEdit, hasList, hasShow } = props || {};

    const definition = useMemo(() => {
        return defaults(
            {},
            {
                hasCreate,
                hasEdit,
                hasList,
                hasShow,
            },
            resourceDefinitions[resource]
        );
    }, [resource, resourceDefinitions, hasCreate, hasEdit, hasList, hasShow]);

    return definition;
};

export interface UseResourceDefinitionOptions {
    readonly resource?: string;
    readonly hasList?: boolean;
    readonly hasEdit?: boolean;
    readonly hasShow?: boolean;
    readonly hasCreate?: boolean;
}
