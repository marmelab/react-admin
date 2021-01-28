import { useSelector } from 'react-redux';
import merge from 'lodash/merge';
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
    const definitionFromRedux = resources.find(r => r?.name === resource);
    const { hasCreate, hasEdit, hasList, hasShow } = props;
    const definitionFromProps = merge({}, definitionFromRedux, {
        hasCreate,
        hasEdit,
        hasList,
        hasShow,
        name: props.resource || definitionFromRedux.name,
    });

    const definition = useMemo(
        () => (props != null ? definitionFromProps : definitionFromRedux),
        // eslint-disable-next-line
        [
            // eslint-disable-next-line
            JSON.stringify(definitionFromProps),
            // eslint-disable-next-line
            JSON.stringify(definitionFromRedux),
        ]
    );

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
