export const CRUD_GET_ONE_REFERENCE = 'CRUD_GET_ONE_REFERENCE';

export const crudGetOneReference = (resource, id) => ({
    type: CRUD_GET_ONE_REFERENCE,
    payload: { resource, id },
});

export const CRUD_GET_MANY_ACCUMULATE = 'CRUD_GET_MANY_ACCUMULATE';

export const crudGetManyAccumulate = (resource, ids) => ({
    type: CRUD_GET_MANY_ACCUMULATE,
    payload: { resource, ids },
});
