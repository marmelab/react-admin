export const CRUD_SHOW_FILTER = 'RA/CRUD_SHOW_FILTER';
export const CRUD_HIDE_FILTER = 'RA/CRUD_HIDE_FILTER';
export const CRUD_SET_FILTER = 'RA/CRUD_SET_FILTER';

export const showFilter = (
    resource: string,
    field: string
): {
    type: string;
    payload: { field: string };
    meta: { resource: string };
} => ({
    type: CRUD_SHOW_FILTER,
    payload: { field },
    meta: { resource },
});

export const hideFilter = (
    resource: string,
    field: string
): {
    type: string;
    payload: { field: string };
    meta: { resource: string };
} => ({
    type: CRUD_HIDE_FILTER,
    payload: { field },
    meta: { resource },
});

export const setFilter = (
    resource: string,
    field: string,
    value: any
): {
    type: string;
    payload: { field: string; value: any };
    meta: { resource: string };
} => ({
    type: CRUD_SET_FILTER,
    payload: { field, value },
    meta: { resource },
});
