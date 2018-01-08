export const CRUD_CHANGE_LIST_SELECTION = 'RA/CRUD_CHANGE_LIST_SELECTION';
export const CRUD_CLEAR_LIST_SELECTION = 'RA/CRUD_CLEAR_LIST_SELECTION';
export const CRUD_CHANGE_LIST_PARAMS = 'RA/CRUD_CHANGE_LIST_PARAMS';

export const changeListParams = (resource, params) => ({
    type: CRUD_CHANGE_LIST_PARAMS,
    payload: params,
    meta: { resource },
});

export const changeListSelection = (
    resource,
    ids,
    selected,
    selectionMode
) => ({
    type: CRUD_CHANGE_LIST_SELECTION,
    payload: {
        ids: Array.isArray(ids) ? ids : [ids],
        selected,
        mode: selectionMode,
    },
    meta: { resource },
});
