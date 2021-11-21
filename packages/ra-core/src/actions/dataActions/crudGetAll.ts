import { Record, PaginationPayload, SortPayload } from '../../types';
import { GET_LIST } from '../../core';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';

export const crudGetAll = (
    resource: string,
    sort: SortPayload,
    filter: object,
    maxResults: number
): CrudGetAllAction => ({
    type: CRUD_GET_ALL,
    payload: { sort, filter, pagination: { page: 1, perPage: maxResults } },
    meta: {
        resource,
        fetch: GET_LIST,
    },
});

interface RequestPayload {
    pagination: PaginationPayload;
    sort: SortPayload;
    filter: object;
}

export const CRUD_GET_ALL = 'RA/CRUD_GET_ALL';
interface CrudGetAllAction {
    readonly type: typeof CRUD_GET_ALL;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof GET_LIST;
    };
}

export const CRUD_GET_ALL_LOADING = 'RA/CRUD_GET_ALL_LOADING';
export interface CrudGetAllLoadingAction {
    readonly type: typeof CRUD_GET_ALL_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
    };
}

export const CRUD_GET_ALL_FAILURE = 'RA/CRUD_GET_ALL_FAILURE';
export interface CrudGetAllFailureAction {
    readonly type: typeof CRUD_GET_ALL_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        fetchResponse: typeof GET_LIST;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_GET_ALL_SUCCESS = 'RA/CRUD_GET_ALL_SUCCESS';
export interface CrudGetAllSuccessAction {
    readonly type: typeof CRUD_GET_ALL_SUCCESS;
    readonly payload: {
        data: Record[];
        total: number;
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        fetchResponse: typeof GET_LIST;
        fetchStatus: typeof FETCH_END;
    };
}
