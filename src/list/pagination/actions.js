export const CRUD_NEXT_PAGE = 'CRUD_NEXT_PAGE';

export const nextPage = (resource) => ({
    type: CRUD_NEXT_PAGE,
    meta: { resource },
});

export const CRUD_PREV_PAGE = 'CRUD_PREV_PAGE';

export const prevPage = (resource) => ({
    type: CRUD_PREV_PAGE,
    meta: { resource },
});

export const CRUD_FIRST_PAGE = 'CRUD_FIRST_PAGE';

export const firstPage = (resource) => ({
    type: CRUD_FIRST_PAGE,
    meta: { resource },
});

export const CRUD_LAST_PAGE = 'CRUD_LAST_PAGE';

export const lastPage = (resource) => ({
    type: CRUD_LAST_PAGE,
    meta: { resource },
});

export const CRUD_GOTO_PAGE = 'CRUD_GOTO_PAGE';

export const gotoPage = (resource, page) => ({
    type: CRUD_GOTO_PAGE,
    payload: { page },
    meta: { resource },
});
