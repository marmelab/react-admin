import React from 'react';
import { createContext, useState } from 'react';
import isEqual from 'lodash/isEqual';

import { ResourceDefinition } from '../types';

export type ResourceDefinitions = {
    [name: string]: ResourceDefinition;
};

export type ResourceDefinitionContextValue = [
    ResourceDefinitions,
    (config: ResourceDefinition) => void
];

export const ResourceDefinitionContext = createContext<
    ResourceDefinitionContextValue
>([{}, () => {}]);

/**
 * Context to store the current resource Definition.
 *
 * Use the useResourceDefinition() hook to read the context.
 *
 * @example
 *
 * import { useResourceDefinition, useTranslate } from 'ra-core';
 *
 * const PostMenuItem = () => {
 *     const { name, icon } = useResourceDefinition({ resource: 'posts' });
 *
 *     return (
 *          <MenuItem>
 *              <ListItemIcon>{icon}</ListItemIcon>
 *              {name}
 *          </MenuItem>
 *     );
 * };
 */
export const ResourceDefinitionContextProvider = ({
    definitions: defaultDefinitions = {},
    children,
}) => {
    const [definitions, setState] = useState<ResourceDefinitions>(
        defaultDefinitions
    );

    const setDefinition = (config: ResourceDefinition) => {
        setState(prev =>
            isEqual(prev[config.name], config)
                ? prev
                : {
                      ...prev,
                      [config.name]: config,
                  }
        );
    };

    return (
        <ResourceDefinitionContext.Provider
            value={[definitions, setDefinition]}
        >
            {children}
        </ResourceDefinitionContext.Provider>
    );
};
