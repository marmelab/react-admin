import {
    ResourceConfiguration,
    ResourceConfigurationMap,
} from './ResourceConfigurationContext';

/**
 * Returns the configuration of a resource, or undefined if there is none.
 * Only the own properties of the map are resource configurations.
 */
export const getResourceConfiguration = (
    resources: ResourceConfigurationMap,
    name: string
): ResourceConfiguration | undefined =>
    resources && Object.prototype.hasOwnProperty.call(resources, name)
        ? resources[name]
        : undefined;
