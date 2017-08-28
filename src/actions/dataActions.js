import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from '../rest/types';

export const CRUD_GET_LIST = 'AOR/CRUD_GET_LIST';
export const CRUD_GET_LIST_LOADING = 'AOR/CRUD_GET_LIST_LOADING';
export const CRUD_GET_LIST_FAILURE = 'AOR/CRUD_GET_LIST_FAILURE';
export const CRUD_GET_LIST_SUCCESS = 'AOR/CRUD_GET_LIST_SUCCESS';

export const crudGetList = (
    resource,
    pagination,
    sort,
    filter,
    cancelPrevious = true
) => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort, filter },
    meta: { resource, fetch: GET_LIST, cancelPrevious },
});

export const CRUD_GET_ONE = 'AOR/CRUD_GET_ONE';
export const CRUD_GET_ONE_LOADING = 'AOR/CRUD_GET_ONE_LOADING';
export const CRUD_GET_ONE_FAILURE = 'AOR/CRUD_GET_ONE_FAILURE';
export const CRUD_GET_ONE_SUCCESS = 'AOR/CRUD_GET_ONE_SUCCESS';

export const crudGetOne = (resource, id, basePath, cancelPrevious = true) => ({
    type: CRUD_GET_ONE,
    payload: { id, basePath },
    meta: { resource, fetch: GET_ONE, cancelPrevious },
});

export const CRUD_CREATE = 'AOR/CRUD_CREATE';
export const CRUD_CREATE_LOADING = 'AOR/CRUD_CREATE_LOADING';
export const CRUD_CREATE_FAILURE = 'AOR/CRUD_CREATE_FAILURE';
export const CRUD_CREATE_SUCCESS = 'AOR/CRUD_CREATE_SUCCESS';

export const crudCreate = (resource, data, basePath, redirectTo = 'edit') => ({
    type: CRUD_CREATE,
    payload: { data, basePath, redirectTo },
    meta: { resource, fetch: CREATE, cancelPrevious: false },
});

export const CRUD_UPDATE = 'AOR/CRUD_UPDATE';
export const CRUD_UPDATE_LOADING = 'AOR/CRUD_UPDATE_LOADING';
export const CRUD_UPDATE_FAILURE = 'AOR/CRUD_UPDATE_FAILURE';
export const CRUD_UPDATE_SUCCESS = 'AOR/CRUD_UPDATE_SUCCESS';

export const crudUpdate = (
    resource,
    id,
    data,
    previousData,
    basePath,
    redirectTo = 'show'
) => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData, basePath, redirectTo },
    meta: { resource, fetch: UPDATE, cancelPrevious: false },
});

export const CRUD_DELETE = 'AOR/CRUD_DELETE';
export const CRUD_DELETE_LOADING = 'AOR/CRUD_DELETE_LOADING';
export const CRUD_DELETE_FAILURE = 'AOR/CRUD_DELETE_FAILURE';
export const CRUD_DELETE_SUCCESS = 'AOR/CRUD_DELETE_SUCCESS';

export const crudDelete = (
    resource,
    id,
    previousData,
    basePath,
    redirectTo = 'list'
) => ({
    type: CRUD_DELETE,
    payload: { id, previousData, basePath, redirectTo },
    meta: { resource, fetch: DELETE, cancelPrevious: false },
});

export const CRUD_GET_MANY = 'AOR/CRUD_GET_MANY';
export const CRUD_GET_MANY_LOADING = 'AOR/CRUD_GET_MANY_LOADING';
export const CRUD_GET_MANY_FAILURE = 'AOR/CRUD_GET_MANY_FAILURE';
export const CRUD_GET_MANY_SUCCESS = 'AOR/CRUD_GET_MANY_SUCCESS';

// Reference related actions

export const crudGetMany = (resource, ids) => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: { resource, fetch: GET_MANY, cancelPrevious: false },
});

export const CRUD_GET_MATCHING = 'AOR/CRUD_GET_MATCHING';
export const CRUD_GET_MATCHING_LOADING = 'AOR/CRUD_GET_MATCHING_LOADING';
export const CRUD_GET_MATCHING_FAILURE = 'AOR/CRUD_GET_MATCHING_FAILURE';
export const CRUD_GET_MATCHING_SUCCESS = 'AOR/CRUD_GET_MATCHING_SUCCESS';

export const crudGetMatching = (
    reference,
    relatedTo,
    pagination,
    sort,
    filter
) => ({
    type: CRUD_GET_MATCHING,
    payload: { pagination, sort, filter },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_LIST,
        cancelPrevious: false,
    },
});

export const CRUD_GET_MANY_REFERENCE = 'AOR/CRUD_GET_MANY_REFERENCE';
export const CRUD_GET_MANY_REFERENCE_LOADING =
    'AOR/CRUD_GET_MANY_REFERENCE_LOADING';
export const CRUD_GET_MANY_REFERENCE_FAILURE =
    'AOR/CRUD_GET_MANY_REFERENCE_FAILURE';
export const CRUD_GET_MANY_REFERENCE_SUCCESS =
    'AOR/CRUD_GET_MANY_REFERENCE_SUCCESS';

export const crudGetManyReference = (
    reference,
    target,
    id,
    relatedTo,
    pagination,
    sort,
    filter
) => ({
    type: CRUD_GET_MANY_REFERENCE,
    payload: { target, id, pagination, sort, filter },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_MANY_REFERENCE,
        cancelPrevious: false,
    },
});
