import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
    BULK_ACTION,
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
    meta: { resource, fetch: CREATE, cancelPrevious: false },
});

export const CRUD_UPDATE = 'RA/CRUD_UPDATE';
export const CRUD_UPDATE_LOADING = 'RA/CRUD_UPDATE_LOADING';
export const CRUD_UPDATE_FAILURE = 'RA/CRUD_UPDATE_FAILURE';
export const CRUD_UPDATE_SUCCESS = 'RA/CRUD_UPDATE_SUCCESS';

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

export const CRUD_DELETE = 'RA/CRUD_DELETE';
export const CRUD_DELETE_LOADING = 'RA/CRUD_DELETE_LOADING';
export const CRUD_DELETE_FAILURE = 'RA/CRUD_DELETE_FAILURE';
export const CRUD_DELETE_SUCCESS = 'RA/CRUD_DELETE_SUCCESS';

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

export const CRUD_BULK_ACTION = 'RA/CRUD_BULK_ACTION';
export const CRUD_BULK_ACTION_LOADING = 'RA/CRUD_BULK_ACTION_LOADING';
export const CRUD_BULK_ACTION_FAILURE = 'RA/CRUD_BULK_ACTION_FAILURE';
export const CRUD_BULK_ACTION_SUCCESS = 'RA/CRUD_BULK_ACTION_SUCCESS';

export const crudExecuteBulkAction = ({
    resource,
    action,
    ids,
    data,
    previousData,
    actionMeta: {
        cacheAction = UPDATE,
        selection,
        notification,
        refreshList,
        ...actionMeta
    } = {},
}) => ({
    type: CRUD_BULK_ACTION,
    payload: { data, action, actionMeta, ids, previousData },
    meta: {
        resource,
        fetch: BULK_ACTION,
        cacheAction,
        selection,
        notification,
        refreshList,
        cancelPrevious: false,
    },
});
