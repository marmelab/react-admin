import * as React from 'react';
import { createContext, useCallback, useState, useMemo } from 'react';
import isEqual from 'lodash/isEqual';

import { ResourceDefinition } from '../types';

export type ResourceDefinitions = {
    [name: string]: ResourceDefinition;
};

export type ResourceDefinitionContextValue = {
    definitions: ResourceDefinitions;
    setDefinition: (config: ResourceDefinition) => void;
    reset: () => void;
};

export const ResourceDefinitionContext = createContext<
    ResourceDefinitionContextValue
>({ definitions: {}, setDefinition: () => {}, reset: () => {} });

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

    const setDefinition = useCallback((config: ResourceDefinition) => {
        setState(prev =>
            isEqual(prev[config.name], config)
                ? prev
                : {
                      ...prev,
                      [config.name]: config,
                  }
        );
    }, []);

    const reset = useCallback(() => {
        setState(defaultDefinitions);
    }, [defaultDefinitions]);

    const contextValue = useMemo(
        () => ({ definitions, setDefinition, reset }),
        [definitions] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return (
        <ResourceDefinitionContext.Provider value={contextValue}>
            {children}
        </ResourceDefinitionContext.Provider>
    );
};
