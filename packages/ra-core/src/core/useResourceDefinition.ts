import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { ResourceDefinition } from '../types';

/**
 * Hook which returns the definition of the requested resource
 */
export const useResourceDefinition = (
    resource: string,
    props
): ResourceDefinition => {
    const resources = useSelector(getResources);

    return resources.find(r => r?.name === resource) || props;
};
