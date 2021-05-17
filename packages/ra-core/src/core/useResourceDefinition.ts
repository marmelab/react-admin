import { useSelector } from 'react-redux';
import extend from 'lodash/extend';
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
        return extend({}, definitionFromRedux, {
            hasCreate,
            hasEdit,
            hasList,
            hasShow,
        });
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
