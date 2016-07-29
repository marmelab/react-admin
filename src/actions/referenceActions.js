export const CRUD_GET_ONE_REFERENCE = 'CRUD_GET_ONE_REFERENCE';

export const crudGetOneReference = (resource, id) => ({
    type: CRUD_GET_ONE_REFERENCE,
    payload: { resource, id },
});

export const CRUD_GET_ONE_REFERENCE_AND_OPTIONS = 'CRUD_GET_ONE_REFERENCE_AND_OPTIONS';

export const crudGetOneReferenceAndOptions = (resource, id) => ({
    type: CRUD_GET_ONE_REFERENCE_AND_OPTIONS,
    payload: { resource, id },
});
