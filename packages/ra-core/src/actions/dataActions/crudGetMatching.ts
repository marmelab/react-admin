import { Record, Pagination, Sort } from '../../types';
import { GET_LIST } from '../../dataFetchActions';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';
import { NotificationSideEffect } from '../../sideEffect';

export type CrudGetMatching = (
    reference: string,
    relatedTo: string,
    pagination: Pagination,
    sort: Sort,
    filter: object
) => void;

export const crudGetMatching = (
    reference: string,
    relatedTo: string,
    pagination: Pagination,
    sort: Sort,
    filter: object
): CrudGetMatchingAction => ({
    type: CRUD_GET_MATCHING,
    payload: { pagination, sort, filter },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_LIST,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

interface RequestPayload {
    pagination: Pagination;
    sort: Sort;
    filter: object;
}

export const CRUD_GET_MATCHING = 'RA/CRUD_GET_MATCHING';
interface CrudGetMatchingAction {
    readonly type: typeof CRUD_GET_MATCHING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof GET_LIST;
        relatedTo: string;
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_GET_MATCHING_LOADING = 'RA/CRUD_GET_MATCHING_LOADING';
export interface CrudGetMatchingLoadingAction {
    readonly type: typeof CRUD_GET_MATCHING_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        relatedTo: string;
    };
}

export const CRUD_GET_MATCHING_FAILURE = 'RA/CRUD_GET_MATCHING_FAILURE';
export interface CrudGetMatchingFailureAction {
    readonly type: typeof CRUD_GET_MATCHING_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        relatedTo: string;
        notification: NotificationSideEffect;
        fetchResponse: typeof GET_LIST;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_GET_MATCHING_SUCCESS = 'RA/CRUD_GET_MATCHING_SUCCESS';
export interface CrudGetMatchingSuccessAction {
    readonly type: typeof CRUD_GET_MATCHING_SUCCESS;
    readonly payload: {
        data: Record[];
        total: number;
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        relatedTo: string;
        fetchResponse: typeof GET_LIST;
        fetchStatus: typeof FETCH_END;
    };
}
