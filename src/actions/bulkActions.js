/**
 * Action creators related with bulk resource management
 */

export const SET_RESOURCE_SELECTION = 'AOR/SET_RESOURCE_SELECTION';
export const UNSET_RESOURCES_SELECTION = 'AOR/UNSET_RESOURCES_SELECTION';

/**
 * Set or unset resource (row) selection
 */
export const setResourceSelection = (resource, resourceId, isSelected) => ({
    type: SET_RESOURCE_SELECTION,
    payload: { resourceId, isSelected },
    meta: { resource },
});

/**
 * Unset selection for all resources (rows)
 */
export const unsetResourcesSelection = resource => ({
    type: UNSET_RESOURCES_SELECTION,
    payload: { resource },
    meta: { resource },
});
