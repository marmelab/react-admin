import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
    GET_MANY,
    GET_MANY_REFERENCE,
} from '../dataFetchActions';

export const CRUD_GET_LIST = 'RA/CRUD_GET_LIST';
export const CRUD_GET_LIST_LOADING = 'RA/CRUD_GET_LIST_LOADING';
export const CRUD_GET_LIST_FAILURE = 'RA/CRUD_GET_LIST_FAILURE';
export const CRUD_GET_LIST_SUCCESS = 'RA/CRUD_GET_LIST_SUCCESS';

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

export const CRUD_GET_ONE = 'RA/CRUD_GET_ONE';
export const CRUD_GET_ONE_LOADING = 'RA/CRUD_GET_ONE_LOADING';
export const CRUD_GET_ONE_FAILURE = 'RA/CRUD_GET_ONE_FAILURE';
export const CRUD_GET_ONE_SUCCESS = 'RA/CRUD_GET_ONE_SUCCESS';

export const crudGetOne = (resource, id, basePath, cancelPrevious = true) => ({
    type: CRUD_GET_ONE,
    payload: { id, basePath },
    meta: { resource, fetch: GET_ONE, cancelPrevious },
});

export const CRUD_CREATE = 'RA/CRUD_CREATE';
export const CRUD_CREATE_LOADING = 'RA/CRUD_CREATE_LOADING';
export const CRUD_CREATE_FAILURE = 'RA/CRUD_CREATE_FAILURE';
export const CRUD_CREATE_SUCCESS = 'RA/CRUD_CREATE_SUCCESS';

export const crudCreate = (resource, data, basePath, redirectTo = 'edit') => ({
    type: CRUD_CREATE,
    payload: { data, basePath, redirectTo },
    meta: {
        resource,
        fetch: CREATE,
        cancelPrevious: false,
        onSuccess: {
            notification: {
                body: 'ra.notification.created',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
        },
    },
});

export const CRUD_UPDATE = 'RA/CRUD_UPDATE';
export const CRUD_UPDATE_LOADING = 'RA/CRUD_UPDATE_LOADING';
export const CRUD_UPDATE_FAILURE = 'RA/CRUD_UPDATE_FAILURE';
export const CRUD_UPDATE_SUCCESS = 'RA/CRUD_UPDATE_SUCCESS';
export const CRUD_UPDATE_OPTIMISTIC = 'RA/CRUD_UPDATE_OPTIMISTIC';

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
    meta: {
        resource,
        fetch: UPDATE,
        cancelPrevious: false,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
        },
    },
});

export const CRUD_UPDATE_MANY = 'RA/CRUD_UPDATE_MANY';
export const CRUD_UPDATE_MANY_LOADING = 'RA/CRUD_UPDATE_MANY_LOADING';
export const CRUD_UPDATE_MANY_FAILURE = 'RA/CRUD_UPDATE_MANY_FAILURE';
export const CRUD_UPDATE_MANY_SUCCESS = 'RA/CRUD_UPDATE_MANY_SUCCESS';
export const CRUD_UPDATE_MANY_OPTIMISTIC = 'RA/CRUD_UPDATE_MANY_OPTIMISTIC';

export const crudUpdateMany = (
    resource,
    ids,
    data,
    basePath,
    refresh = true,
    unselectAll = true
) => ({
    type: CRUD_UPDATE_MANY,
    payload: { ids, data, basePath, refresh, unselectAll },
    meta: {
        resource,
        fetch: UPDATE_MANY,
        cancelPrevious: false,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
                level: 'info',
                messageArgs: {
                    smart_count: ids.length,
                },
            },
        },
    },
});

export const CRUD_DELETE = 'RA/CRUD_DELETE';
export const CRUD_DELETE_LOADING = 'RA/CRUD_DELETE_LOADING';
export const CRUD_DELETE_FAILURE = 'RA/CRUD_DELETE_FAILURE';
export const CRUD_DELETE_SUCCESS = 'RA/CRUD_DELETE_SUCCESS';
export const CRUD_DELETE_OPTIMISTIC = 'RA/CRUD_DELETE_OPTIMISTIC';

export const crudDelete = (
    resource,
    id,
    previousData,
    basePath,
    redirectTo = 'list'
) => ({
    type: CRUD_DELETE,
    payload: { id, previousData, basePath, redirectTo },
    meta: {
        resource,
        fetch: DELETE,
        cancelPrevious: false,
        onSuccess: {
            notification: {
                body: 'ra.notification.deleted',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
        },
    },
});

export const CRUD_DELETE_MANY = 'RA/CRUD_DELETE_MANY';
export const CRUD_DELETE_MANY_LOADING = 'RA/CRUD_DELETE_MANY_LOADING';
export const CRUD_DELETE_MANY_FAILURE = 'RA/CRUD_DELETE_MANY_FAILURE';
export const CRUD_DELETE_MANY_SUCCESS = 'RA/CRUD_DELETE_MANY_SUCCESS';
export const CRUD_DELETE_MANY_OPTIMISTIC = 'RA/CRUD_DELETE_MANY_OPTIMISTIC';

export const crudDeleteMany = (resource, ids, basePath, refresh = true) => ({
    type: CRUD_DELETE_MANY,
    payload: { ids, basePath, refresh, unselectAll: true },
    meta: {
        resource,
        fetch: DELETE_MANY,
        cancelPrevious: false,
        onSuccess: {
            notification: {
                body: 'ra.notification.deleted',
                level: 'info',
                messageArgs: {
                    smart_count: ids.length,
                },
            },
        },
    },
});

export const CRUD_GET_MANY = 'RA/CRUD_GET_MANY';
export const CRUD_GET_MANY_LOADING = 'RA/CRUD_GET_MANY_LOADING';
export const CRUD_GET_MANY_FAILURE = 'RA/CRUD_GET_MANY_FAILURE';
export const CRUD_GET_MANY_SUCCESS = 'RA/CRUD_GET_MANY_SUCCESS';

// Reference related actions

export const crudGetMany = (resource, ids) => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: { resource, fetch: GET_MANY, cancelPrevious: false },
});

export const CRUD_GET_MATCHING = 'RA/CRUD_GET_MATCHING';
export const CRUD_GET_MATCHING_LOADING = 'RA/CRUD_GET_MATCHING_LOADING';
export const CRUD_GET_MATCHING_FAILURE = 'RA/CRUD_GET_MATCHING_FAILURE';
export const CRUD_GET_MATCHING_SUCCESS = 'RA/CRUD_GET_MATCHING_SUCCESS';

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

export const CRUD_GET_MANY_REFERENCE = 'RA/CRUD_GET_MANY_REFERENCE';
export const CRUD_GET_MANY_REFERENCE_LOADING =
    'RA/CRUD_GET_MANY_REFERENCE_LOADING';
export const CRUD_GET_MANY_REFERENCE_FAILURE =
    'RA/CRUD_GET_MANY_REFERENCE_FAILURE';
export const CRUD_GET_MANY_REFERENCE_SUCCESS =
    'RA/CRUD_GET_MANY_REFERENCE_SUCCESS';

export const crudGetManyReference = (
    reference,
    target,
    id,
    relatedTo,
    pagination,
    sort,
    filter,
    source
) => ({
    type: CRUD_GET_MANY_REFERENCE,
    payload: { target, id, pagination, sort, filter, source },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_MANY_REFERENCE,
        cancelPrevious: false,
    },
});
