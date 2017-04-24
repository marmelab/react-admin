export const CRUD_GET_ONE_REFERENCE = 'CRUD_GET_ONE_REFERENCE';

export const crudGetOneReference = (resource, id) => ({
    type: CRUD_GET_ONE_REFERENCE,
    payload: { resource, id },
});

export const CRUD_DEBOUNCED_GET_MANY = 'CRUD_DEBOUNCED_GET_MANY';

export const crudDebouncedGetMany = (resource, ids) => ({
    type: CRUD_DEBOUNCED_GET_MANY,
    payload: { resource, ids },
});
