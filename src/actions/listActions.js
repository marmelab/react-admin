export const CRUD_CHANGE_LIST_PARAMS = 'AOR/CRUD_CHANGE_LIST_PARAMS';
export const CRUD_REFRESH_LIST = 'AOR/CRUD_REFRESH_LIST';

export const changeListParams = (resource, params) => ({
    type: CRUD_CHANGE_LIST_PARAMS,
    payload: params,
    meta: { resource },
});

export const refreshList = resource => ({
    type: CRUD_REFRESH_LIST,
    meta: { resource },
});
