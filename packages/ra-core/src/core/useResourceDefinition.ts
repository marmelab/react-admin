import { useSelector } from 'react-redux';
import defaults from 'lodash/defaults';
import { getResources } from '../reducer';
import { ResourceDefinition } from '../types';
import { useResourceContext } from './useResourceContext';
import { useMemo } from 'react';

/**
 * Hook which returns the definition of the requested resource
 */
export const useResourceDefinition = (
    props: UseResourceDefinitionOptions
): ResourceDefinition => {
    const resource = useResourceContext(props);
    const resources = useSelector(getResources);
    const { hasCreate, hasEdit, hasList, hasShow } = props;

    const definition = useMemo(() => {
        const definitionFromRedux = resources.find(r => r?.name === resource);
        return defaults(
            {},
            {
                hasCreate,
                hasEdit,
                hasList,
                hasShow,
            },
            definitionFromRedux
        );
    }, [resource, resources, hasCreate, hasEdit, hasList, hasShow]);

    return definition;
};

export interface UseResourceDefinitionOptions {
    readonly resource?: string;
    readonly options?: any;
    readonly hasList?: boolean;
    readonly hasEdit?: boolean;
    readonly hasShow?: boolean;
    readonly hasCreate?: boolean;
    readonly icon?: any;
}
