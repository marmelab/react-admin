import { useSelector } from 'react-redux';
import { getResources } from '../reducer';
import { ResourceDefinition } from '../types';

/**
 * Hook which returns the configuration of the requested resource
 */
export const useResourceConfig = (resource: string): ResourceDefinition => {
    const resources = useSelector(getResources);
    return resources.find(r => r.name === resource);
};
