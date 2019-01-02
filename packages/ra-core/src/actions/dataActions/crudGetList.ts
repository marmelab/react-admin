import { GET_LIST } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';

interface CrudGetListGenericAction<T> {
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
    };
}

export const CRUD_GET_LIST = 'RA/CRUD_GET_LIST';
export type CrudGetListAction = CrudGetListGenericAction<typeof CRUD_GET_LIST>;

export const crudGetList = (
    resource,
    pagination,
    sort,
    filter
): CrudGetListAction => ({
    type: CRUD_GET_LIST,
    payload: { pagination, sort, filter },
    meta: {
        resource,
        fetch: GET_LIST,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_LIST_LOADING = 'RA/CRUD_GET_LIST_LOADING';
export type CrudGetListLoadingAction = CrudGetListGenericAction<
    typeof CRUD_GET_LIST_LOADING
>;

export const CRUD_GET_LIST_FAILURE = 'RA/CRUD_GET_LIST_FAILURE';
export type CrudGetListFailureAction = CrudGetListGenericAction<
    typeof CRUD_GET_LIST_FAILURE
>;

export const CRUD_GET_LIST_SUCCESS = 'RA/CRUD_GET_LIST_SUCCESS';
export type CrudGetListSuccessAction = CrudGetListGenericAction<
    typeof CRUD_GET_LIST_SUCCESS
>;
