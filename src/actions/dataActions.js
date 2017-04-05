import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from '../rest/types';

export const CRUD_GET_LIST = 'admin-on-rest/CRUD_GET_LIST';
export const CRUD_GET_LIST_LOADING = 'admin-on-rest/CRUD_GET_LIST_LOADING';
export const CRUD_GET_LIST_FAILURE = 'admin-on-rest/CRUD_GET_LIST_FAILURE';
export const CRUD_GET_LIST_SUCCESS = 'admin-on-rest/CRUD_GET_LIST_SUCCESS';

export const crudGetList = (resource, pagination, sort, filter, cancelPrevious = true) => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort, filter },
    meta: { resource, fetch: GET_LIST, cancelPrevious },
});

export const CRUD_GET_ONE = 'admin-on-rest/CRUD_GET_ONE';
export const CRUD_GET_ONE_LOADING = 'admin-on-rest/CRUD_GET_ONE_LOADING';
export const CRUD_GET_ONE_FAILURE = 'admin-on-rest/CRUD_GET_ONE_FAILURE';
export const CRUD_GET_ONE_SUCCESS = 'admin-on-rest/CRUD_GET_ONE_SUCCESS';

export const crudGetOne = (resource, id, basePath, cancelPrevious = true) => ({
    type: CRUD_GET_ONE,
    payload: { id, basePath },
    meta: { resource, fetch: GET_ONE, cancelPrevious },
});

export const CRUD_CREATE = 'admin-on-rest/CRUD_CREATE';
export const CRUD_CREATE_LOADING = 'admin-on-rest/CRUD_CREATE_LOADING';
export const CRUD_CREATE_FAILURE = 'admin-on-rest/CRUD_CREATE_FAILURE';
export const CRUD_CREATE_SUCCESS = 'admin-on-rest/CRUD_CREATE_SUCCESS';

export const crudCreate = (resource, data, basePath, redirect = true) => ({
    type: CRUD_CREATE,
    payload: { data, basePath, redirect },
    meta: { resource, fetch: CREATE, cancelPrevious: false },
});

export const CRUD_UPDATE = 'admin-on-rest/CRUD_UPDATE';
export const CRUD_UPDATE_LOADING = 'admin-on-rest/CRUD_UPDATE_LOADING';
export const CRUD_UPDATE_FAILURE = 'admin-on-rest/CRUD_UPDATE_FAILURE';
export const CRUD_UPDATE_SUCCESS = 'admin-on-rest/CRUD_UPDATE_SUCCESS';

export const crudUpdate = (resource, id, data, previousData, basePath, redirect = true) => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData, basePath, redirect },
    meta: { resource, fetch: UPDATE, cancelPrevious: false },
});

export const CRUD_DELETE = 'admin-on-rest/CRUD_DELETE';
export const CRUD_DELETE_LOADING = 'admin-on-rest/CRUD_DELETE_LOADING';
export const CRUD_DELETE_FAILURE = 'admin-on-rest/CRUD_DELETE_FAILURE';
export const CRUD_DELETE_SUCCESS = 'admin-on-rest/CRUD_DELETE_SUCCESS';

export const crudDelete = (resource, id, basePath, redirect = true) => ({
    type: CRUD_DELETE,
    payload: { id, basePath, redirect },
    meta: { resource, fetch: DELETE, cancelPrevious: false },
});

export const CRUD_GET_MANY = 'admin-on-rest/CRUD_GET_MANY';
export const CRUD_GET_MANY_LOADING = 'admin-on-rest/CRUD_GET_MANY_LOADING';
export const CRUD_GET_MANY_FAILURE = 'admin-on-rest/CRUD_GET_MANY_FAILURE';
export const CRUD_GET_MANY_SUCCESS = 'admin-on-rest/CRUD_GET_MANY_SUCCESS';

// Reference related actions

export const crudGetMany = (resource, ids) => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: { resource, fetch: GET_MANY, cancelPrevious: false },
});

export const CRUD_GET_MATCHING = 'admin-on-rest/CRUD_GET_MATCHING';
export const CRUD_GET_MATCHING_LOADING = 'admin-on-rest/CRUD_GET_MATCHING_LOADING';
export const CRUD_GET_MATCHING_FAILURE = 'admin-on-rest/CRUD_GET_MATCHING_FAILURE';
export const CRUD_GET_MATCHING_SUCCESS = 'admin-on-rest/CRUD_GET_MATCHING_SUCCESS';

export const crudGetMatching = (reference, relatedTo, pagination, sort, filter) => ({
    type: CRUD_GET_MATCHING,
    payload: { pagination, sort, filter },
    meta: { resource: reference, relatedTo, fetch: GET_LIST, cancelPrevious: false },
});

export const CRUD_GET_MANY_REFERENCE = 'admin-on-rest/CRUD_GET_MANY_REFERENCE';
export const CRUD_GET_MANY_REFERENCE_LOADING = 'admin-on-rest/CRUD_GET_MANY_REFERENCE_LOADING';
export const CRUD_GET_MANY_REFERENCE_FAILURE = 'admin-on-rest/CRUD_GET_MANY_REFERENCE_FAILURE';
export const CRUD_GET_MANY_REFERENCE_SUCCESS = 'admin-on-rest/CRUD_GET_MANY_REFERENCE_SUCCESS';

export const crudGetManyReference = (reference, target, id, relatedTo, pagination, sort, filter) => ({
    type: CRUD_GET_MANY_REFERENCE,
    payload: { target, id, pagination, sort, filter },
    meta: { resource: reference, relatedTo, fetch: GET_MANY_REFERENCE, cancelPrevious: false },
});
