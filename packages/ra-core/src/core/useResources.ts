import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { ResourceDefinition } from '../types';

/**
 * Hook which returns an array of all registered resources
 */
export const useResources = (): ResourceDefinition[] => {
    const resources = useSelector(getResources);
    return resources;
};
