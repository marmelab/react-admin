export const CRUD_FETCH_RECORD = 'CRUD_FETCH_RECORD';
export const CRUD_FETCH_RECORD_LOADING = 'CRUD_FETCH_RECORD_LOADING';
export const CRUD_FETCH_RECORD_SUCCESS = 'CRUD_FETCH_RECORD_SUCCESS';
export const CRUD_FETCH_RECORD_FAILURE = 'CRUD_FETCH_RECORD_FAILURE';

export const fetchRecord = (resource, url, options) => ({
    type: CRUD_FETCH_RECORD,
    payload: { url, options },
    meta: { resource },
});
