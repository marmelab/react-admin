export const CRUD_CHANGE_LIST_PARAMS = 'CRUD_CHANGE_LIST_PARAMS'
export const CRUD_REFRESH_LIST = 'CRUD_REFRESH_LIST'

export const changeListParams = (resource, params) => ({
    type: CRUD_CHANGE_LIST_PARAMS,
    payload: params,
    meta: {resource},
})

export const refreshList = resource => ({
    type: CRUD_REFRESH_LIST,
    meta: {resource},
})
