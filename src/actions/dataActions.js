import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from '../rest/types';

export const CRUD_GET_LIST = 'aor/CRUD_GET_LIST';
export const CRUD_GET_LIST_LOADING = 'aor/CRUD_GET_LIST_LOADING';
export const CRUD_GET_LIST_FAILURE = 'aor/CRUD_GET_LIST_FAILURE';
export const CRUD_GET_LIST_SUCCESS = 'aor/CRUD_GET_LIST_SUCCESS';

export const crudGetList = (resource, pagination, sort, filter, cancelPrevious = true) => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort, filter },
    meta: { resource, fetch: GET_LIST, cancelPrevious },
});

export const CRUD_GET_ONE = 'aor/CRUD_GET_ONE';
export const CRUD_GET_ONE_LOADING = 'aor/CRUD_GET_ONE_LOADING';
export const CRUD_GET_ONE_FAILURE = 'aor/CRUD_GET_ONE_FAILURE';
export const CRUD_GET_ONE_SUCCESS = 'aor/CRUD_GET_ONE_SUCCESS';

export const crudGetOne = (resource, id, basePath, cancelPrevious = true) => ({
    type: CRUD_GET_ONE,
    payload: { id, basePath },
    meta: { resource, fetch: GET_ONE, cancelPrevious },
});

export const CRUD_CREATE = 'aor/CRUD_CREATE';
export const CRUD_CREATE_LOADING = 'aor/CRUD_CREATE_LOADING';
export const CRUD_CREATE_FAILURE = 'aor/CRUD_CREATE_FAILURE';
export const CRUD_CREATE_SUCCESS = 'aor/CRUD_CREATE_SUCCESS';

export const crudCreate = (resource, data, basePath, redirect = true) => ({
    type: CRUD_CREATE,
    payload: { data, basePath, redirect },
    meta: { resource, fetch: CREATE, cancelPrevious: false },
});

export const CRUD_UPDATE = 'aor/CRUD_UPDATE';
export const CRUD_UPDATE_LOADING = 'aor/CRUD_UPDATE_LOADING';
export const CRUD_UPDATE_FAILURE = 'aor/CRUD_UPDATE_FAILURE';
export const CRUD_UPDATE_SUCCESS = 'aor/CRUD_UPDATE_SUCCESS';

export const crudUpdate = (resource, id, data, previousData, basePath, redirect = true) => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData, basePath, redirect },
    meta: { resource, fetch: UPDATE, cancelPrevious: false },
});

export const CRUD_DELETE = 'aor/CRUD_DELETE';
export const CRUD_DELETE_LOADING = 'aor/CRUD_DELETE_LOADING';
export const CRUD_DELETE_FAILURE = 'aor/CRUD_DELETE_FAILURE';
export const CRUD_DELETE_SUCCESS = 'aor/CRUD_DELETE_SUCCESS';

export const crudDelete = (resource, id, basePath, redirect = true) => ({
    type: CRUD_DELETE,
    payload: { id, basePath, redirect },
    meta: { resource, fetch: DELETE, cancelPrevious: false },
});

export const CRUD_GET_MANY = 'aor/CRUD_GET_MANY';
export const CRUD_GET_MANY_LOADING = 'aor/CRUD_GET_MANY_LOADING';
export const CRUD_GET_MANY_FAILURE = 'aor/CRUD_GET_MANY_FAILURE';
export const CRUD_GET_MANY_SUCCESS = 'aor/CRUD_GET_MANY_SUCCESS';

// Reference related actions

export const crudGetMany = (resource, ids) => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: { resource, fetch: GET_MANY, cancelPrevious: false },
});

export const CRUD_GET_MATCHING = 'aor/CRUD_GET_MATCHING';
export const CRUD_GET_MATCHING_LOADING = 'aor/CRUD_GET_MATCHING_LOADING';
export const CRUD_GET_MATCHING_FAILURE = 'aor/CRUD_GET_MATCHING_FAILURE';
export const CRUD_GET_MATCHING_SUCCESS = 'aor/CRUD_GET_MATCHING_SUCCESS';

export const crudGetMatching = (reference, relatedTo, pagination, sort, filter) => ({
    type: CRUD_GET_MATCHING,
    payload: { pagination, sort, filter },
    meta: { resource: reference, relatedTo, fetch: GET_LIST, cancelPrevious: false },
});

export const CRUD_GET_MANY_REFERENCE = 'aor/CRUD_GET_MANY_REFERENCE';
export const CRUD_GET_MANY_REFERENCE_LOADING = 'aor/CRUD_GET_MANY_REFERENCE_LOADING';
export const CRUD_GET_MANY_REFERENCE_FAILURE = 'aor/CRUD_GET_MANY_REFERENCE_FAILURE';
export const CRUD_GET_MANY_REFERENCE_SUCCESS = 'aor/CRUD_GET_MANY_REFERENCE_SUCCESS';

export const crudGetManyReference = (reference, target, id, relatedTo, pagination, sort, filter) => ({
    type: CRUD_GET_MANY_REFERENCE,
    payload: { target, id, pagination, sort, filter },
    meta: { resource: reference, relatedTo, fetch: GET_MANY_REFERENCE, cancelPrevious: false },
});
