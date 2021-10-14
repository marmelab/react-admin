import { Identifier, Record } from '../../types';
import { DELETE_MANY } from '../../core';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';

export const crudDeleteMany = (
    resource: string,
    ids: Identifier[]
): CrudDeleteManyAction => ({
    type: CRUD_DELETE_MANY,
    payload: { ids },
    meta: {
        resource,
        fetch: DELETE_MANY,
    },
});

interface RequestPayload {
    ids: Identifier[];
}

export const CRUD_DELETE_MANY = 'RA/CRUD_DELETE_MANY';
export interface CrudDeleteManyAction {
    readonly type: typeof CRUD_DELETE_MANY;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof DELETE_MANY;
    };
}

export const CRUD_DELETE_MANY_LOADING = 'RA/CRUD_DELETE_MANY_LOADING';
export interface CrudDeleteManyLoadingAction {
    readonly type: typeof CRUD_DELETE_MANY_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
    };
}

export const CRUD_DELETE_MANY_FAILURE = 'RA/CRUD_DELETE_MANY_FAILURE';
export interface CrudDeleteMAnyFailureAction {
    readonly type: typeof CRUD_DELETE_MANY_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        fetchResponse: typeof DELETE_MANY;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_DELETE_MANY_SUCCESS = 'RA/CRUD_DELETE_MANY_SUCCESS';
export interface CrudDeleteManySuccessAction {
    readonly type: typeof CRUD_DELETE_MANY_SUCCESS;
    readonly payload: {
        data: Record[];
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        fetchResponse: typeof DELETE_MANY;
        fetchStatus: typeof FETCH_END;
    };
}
