import fetch from '../util/fetch';

export const CRUD_FETCH_LIST = 'CRUD_FETCH_LIST';
export const CRUD_FETCH_LIST_LOADING = 'CRUD_FETCH_LIST_LOADING';
export const CRUD_FETCH_LIST_SUCCESS = 'CRUD_FETCH_LIST_SUCCESS';
export const CRUD_FETCH_LIST_FAILURE = 'CRUD_FETCH_LIST_FAILURE';

export const fetchList = (resource) => (url, options) => ({
    type: CRUD_FETCH_LIST,
    payload: { url, options },
    meta: { resource },
});
