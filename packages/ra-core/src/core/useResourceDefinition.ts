import { useSelector } from 'react-redux';
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

    if (
        props.resource &&
        (typeof props.hasCreate !== 'undefined' ||
            typeof props.hasEdit !== 'undefined' ||
            typeof props.hasList !== 'undefined' ||
            typeof props.hasShow !== 'undefined')
    ) {
        return {
            ...props,
            name: props.resource,
        };
    }

    return resources.find(r => r?.name === resource) || props;
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
