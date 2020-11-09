import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { ResourceDefinition } from '../types';
import { useResourceContext } from './useResourceContext';

/**
 * Hook which returns the definition of the requested resource
 */
export const useResourceDefinition = (props): ResourceDefinition => {
    const resource = useResourceContext(props);
    const resources = useSelector(getResources);

    return resources.find(r => r?.name === resource) || props;
};
