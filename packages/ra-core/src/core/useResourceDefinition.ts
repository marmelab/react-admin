import { useSelector } from 'react-redux';
import merge from 'lodash/merge';
import { getResources } from '../reducer';
import { ResourceDefinition } from '../types';
import { useResourceContext } from './useResourceContext';

/**
 * Hook which returns the definition of the requested resource
 */
export const useResourceDefinition = (
    props: UseResourceDefinitionOptions
): ResourceDefinition => {
    const resource = useResourceContext(props);
    const resources = useSelector(getResources);
    const definition = resources.find(r => r?.name === resource) || props;
    const { hasCreate, hasEdit, hasList, hasShow } = props;
    return props != null
        ? merge({}, definition, {
              hasCreate,
              hasEdit,
              hasList,
              hasShow,
              name: props.resource || definition.name,
          })
        : definition;
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
