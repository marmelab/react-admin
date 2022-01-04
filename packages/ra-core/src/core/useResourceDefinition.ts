import { useMemo } from 'react';
import defaults from 'lodash/defaults';

import { useResourceDefinitions } from './useResourceDefinitions';
import { useResourceContext } from './useResourceContext';
import { ResourceDefinition } from '../types';

/**
 * Hook to get the definition of a given resource
 *
 * @example // Get the current resource definition (based on ResourceContext)
 *
 * const definition = useResourceDefinition();
 * console.log(definition);
 * // {
 * //   name: 'posts',
 * //   hasList: true,
 * //   hasEdit: true,
 * //   hasShow: true,
 * //   hasCreate: true,
 * //   options: {},
 * //   icon: PostIcon,
 * // }
 *
 * @example // Pass a resource prop to check a different resource definition
 *
 * const definition = useResourceDefinition({ resource: 'posts' });
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
