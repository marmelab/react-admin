import { GET_LIST } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';

interface CrudGetAllGenericAction<T> {
    readonly type: T;
    readonly payload: {
        pagination: { page: number; perPage: number };
        sort: { field: string; order: string };
        filter: object;
    };
    readonly meta: {
        resource: string;
        fetch: typeof GET_LIST;
        onFailure: {
            notification: NotificationSideEffect;
        };
        onSuccess: {
            callback: any;
        };
    };
}

export const CRUD_GET_ALL = 'RA/CRUD_GET_ALL';
export type CrudGetAllAction = CrudGetAllGenericAction<typeof CRUD_GET_ALL>;

export const crudGetAll = (
    resource,
    sort,
    filter,
    maxResults,
    callback
): CrudGetAllAction => ({
    type: CRUD_GET_ALL,
    payload: { sort, filter, pagination: { page: 1, perPage: maxResults } },
    meta: {
        resource,
        fetch: GET_LIST,
        onSuccess: {
            callback,
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_ALL_LOADING = 'RA/CRUD_GET_ALL_LOADING';
export type CrudGetAllLoadingAction = CrudGetAllGenericAction<
    typeof CRUD_GET_ALL_LOADING
>;

export const CRUD_GET_ALL_FAILURE = 'RA/CRUD_GET_ALL_FAILURE';
export type CrudGetAllFailingAction = CrudGetAllGenericAction<
    typeof CRUD_GET_ALL_FAILURE
>;

export const CRUD_GET_ALL_SUCCESS = 'RA/CRUD_GET_ALL_SUCCESS';
export type CrudGetAllSuccessAction = CrudGetAllGenericAction<
    typeof CRUD_GET_ALL_SUCCESS
>;
