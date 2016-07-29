import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    CREATE,
    UPDATE,
    DELETE,
} from '../rest/types';

export const CRUD_GET_LIST = 'CRUD_GET_LIST';
export const CRUD_GET_LIST_LOADING = 'CRUD_GET_LIST_LOADING';
export const CRUD_GET_LIST_FAILURE = 'CRUD_GET_LIST_FAILURE';
export const CRUD_GET_LIST_SUCCESS = 'CRUD_GET_LIST_SUCCESS';

export const crudGetList = (resource, pagination, sort) => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort },
    meta: { resource, fetch: GET_LIST, cancelPrevious: true },
});

export const CRUD_GET_ONE = 'CRUD_GET_ONE';
export const CRUD_GET_ONE_LOADING = 'CRUD_GET_ONE_LOADING';
export const CRUD_GET_ONE_FAILURE = 'CRUD_GET_ONE_FAILURE';
export const CRUD_GET_ONE_SUCCESS = 'CRUD_GET_ONE_SUCCESS';

export const crudGetOne = (resource, id, basePath) => ({
    type: CRUD_GET_ONE,
    payload: { id, basePath },
    meta: { resource, fetch: GET_ONE, cancelPrevious: true },
});

export const CRUD_GET_MANY = 'CRUD_GET_MANY';
export const CRUD_GET_MANY_LOADING = 'CRUD_GET_MANY_LOADING';
export const CRUD_GET_MANY_FAILURE = 'CRUD_GET_MANY_FAILURE';
export const CRUD_GET_MANY_SUCCESS = 'CRUD_GET_MANY_SUCCESS';

export const crudGetMany = (resource, ids) => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: { resource, fetch: GET_MANY, cancelPrevious: false },
});

export const CRUD_CREATE = 'CRUD_CREATE';
export const CRUD_CREATE_LOADING = 'CRUD_CREATE_LOADING';
export const CRUD_CREATE_FAILURE = 'CRUD_CREATE_FAILURE';
export const CRUD_CREATE_SUCCESS = 'CRUD_CREATE_SUCCESS';

export const crudCreate = (resource, data, basePath) => ({
    type: CRUD_CREATE,
    payload: { data, basePath },
    meta: { resource, fetch: CREATE, cancelPrevious: true },
});

export const CRUD_UPDATE = 'CRUD_UPDATE';
export const CRUD_UPDATE_LOADING = 'CRUD_UPDATE_LOADING';
export const CRUD_UPDATE_FAILURE = 'CRUD_UPDATE_FAILURE';
export const CRUD_UPDATE_SUCCESS = 'CRUD_UPDATE_SUCCESS';

export const crudUpdate = (resource, id, data, basePath) => ({
    type: CRUD_UPDATE,
    payload: { id, data, basePath },
    meta: { resource, fetch: UPDATE, cancelPrevious: true },
});

export const CRUD_DELETE = 'CRUD_DELETE';
export const CRUD_DELETE_LOADING = 'CRUD_DELETE_LOADING';
export const CRUD_DELETE_FAILURE = 'CRUD_DELETE_FAILURE';
export const CRUD_DELETE_SUCCESS = 'CRUD_DELETE_SUCCESS';

export const crudDelete = (resource, id) => ({
    type: CRUD_DELETE,
    payload: { id },
    meta: { resource, fetch: DELETE, cancelPrevious: true },
});
