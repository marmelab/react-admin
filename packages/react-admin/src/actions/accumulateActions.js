import { crudGetMany } from './dataActions';

export const CRUD_GET_MANY_ACCUMULATE = 'RA/CRUD_GET_MANY_ACCUMULATE';

export const crudGetManyAccumulate = (resource, ids) => ({
    type: CRUD_GET_MANY_ACCUMULATE,
    payload: { resource, ids },
    meta: { accumulate: crudGetMany },
});
