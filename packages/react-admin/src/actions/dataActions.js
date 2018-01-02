import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from '../dataFetchActions';

import { promisingActionCreator } from '../util/promisingActionCreator';

export const crudGetList = promisingActionCreator(
    `RA/CRUD_${GET_LIST}`,
    ({ resource, pagination, sort, filter, cancelPrevious = true }) => ({
        payload: { pagination, sort, filter },
        meta: { resource, fetch: GET_LIST, cancelPrevious },
    })
);

export const crudGetOne = promisingActionCreator(
    `RA/CRUD_${GET_ONE}`,
    ({ resource, id, basePath, cancelPrevious = true }) => ({
        payload: { id, basePath },
        meta: { resource, fetch: GET_ONE, cancelPrevious },
    })
);

export const crudCreate = promisingActionCreator(
    `RA/CRUD_${CREATE}`,
    ({ resource, data, basePath, redirectTo = 'edit' }) => ({
        payload: { data, basePath, redirectTo },
        meta: { resource, fetch: CREATE, cancelPrevious: false },
    })
);

export const crudUpdate = promisingActionCreator(
    `RA/CRUD_${UPDATE}`,
    ({ resource, id, data, previousData, basePath, redirectTo = 'show' }) => ({
        payload: { id, data, previousData, basePath, redirectTo },
        meta: { resource, fetch: UPDATE, cancelPrevious: false },
    })
);

export const crudDelete = promisingActionCreator(
    `RA/CRUD_${DELETE}`,
    ({ resource, id, previousData, basePath, redirectTo = 'list' }) => ({
        payload: { id, previousData, basePath, redirectTo },
        meta: { resource, fetch: DELETE, cancelPrevious: false },
    })
);

export const crudGetMany = promisingActionCreator(
    `RA/CRUD_${GET_MANY}`,
    ({ resource, ids }) => ({
        payload: { ids },
        meta: { resource, fetch: GET_MANY, cancelPrevious: false },
    })
);

export const crudGetMatching = promisingActionCreator(
    `RA/CRUD_GET_MATCHING`,
    ({ reference, relatedTo, pagination, sort, filter }) => ({
        payload: { pagination, sort, filter },
        meta: {
            resource: reference,
            relatedTo,
            fetch: GET_LIST,
            cancelPrevious: false,
        },
    })
);

export const crudGetManyReference = promisingActionCreator(
    `RA/CRUD_${GET_MANY_REFERENCE}`,
    ({ reference, target, id, relatedTo, pagination, sort, filter }) => ({
        payload: { target, id, pagination, sort, filter },
        meta: {
            resource: reference,
            relatedTo,
            fetch: GET_MANY_REFERENCE,
            cancelPrevious: false,
        },
    })
);
