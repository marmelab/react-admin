/**
 * Actions related with bulk actions (only deletion for now)
 */

export const SET_RESOURCE_SELECTION = 'AOR/SET_RESOURCE_SELECTION';

/**
 * Mark resource as selected (or not selected)
 */
export const setResourceSelection = (resource, resourceId, isSelected) => ({
    type: SET_RESOURCE_SELECTION,
    payload: { resourceId, isSelected },
    meta: { resource },
});

// TODO: add reset selection
