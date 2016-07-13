export const CRUD_SET_SORT = 'CRUD_SET_SORT';
export const SORT_ASC = 'ASC';
export const SORT_DESC = 'DESC';

export const setSort = (resource, field, order = SORT_ASC) => ({
    type: CRUD_SET_SORT,
    payload: { field, order },
    meta: { resource },
});
