export const CRUD_FETCH = 'CRUD_FETCH';

// derived action types
export const CRUD_FETCH_LOADING = 'CRUD_FETCH_LOADING';
export const CRUD_FETCH_SUCCESS = 'CRUD_FETCH_SUCCESS';
export const CRUD_FETCH_FAILURE = 'CRUD_FETCH_FAILURE';

// subtypes
export const GET_MANY = 'GET_MANY';
export const GET_ONE = 'GET_ONE';
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';

export const crudFetch = (resource, method, params) => ({
    type: CRUD_FETCH,
    payload: { method, params },
    meta: { resource },
});
