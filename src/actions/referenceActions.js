import { GET_ONE } from '../rest/types';
import { CRUD_GET_ONE } from './dataActions';

export const CRUD_GET_ONE_REFERENCE_GROUPED = 'CRUD_GET_ONE_REFERENCE_GROUPED';

export const crudGetOneReferenceGrouped = (resource, id) => ({
    type: CRUD_GET_ONE_REFERENCE_GROUPED,
    payload: { resource, id },
});

export const CRUD_GET_ONE_REFERENCE = 'CRUD_GET_ONE_REFERENCE';

export const crudGetOneReference = (resource, id) => ({
    type: CRUD_GET_ONE,
    payload: { id },
    meta: { resource, fetch: GET_ONE, cancelPrevious: true },
});
