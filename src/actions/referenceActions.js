export const CRUD_GET_ONE_REFERENCE = 'admin-on-rest/CRUD_GET_ONE_REFERENCE';

export const crudGetOneReference = (resource, id) => ({
    type: CRUD_GET_ONE_REFERENCE,
    payload: { resource, id },
});
