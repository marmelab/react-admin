import { GET_MANY } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';

interface CrudGetManyGenericAction<T> {
    readonly type: T;
    readonly payload: {
        ids: [string];
    };
    readonly meta: {
        resource: string;
        fetch: typeof GET_MANY;
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_GET_MANY = 'RA/CRUD_GET_MANY';
export type CrudGetManyAction = CrudGetManyGenericAction<typeof CRUD_GET_MANY>;

export const crudGetMany = (resource, ids): CrudGetManyAction => ({
    type: CRUD_GET_MANY,
    payload: { ids },
    meta: {
        resource,
        fetch: GET_MANY,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_MANY_LOADING = 'RA/CRUD_GET_MANY_LOADING';
export type CrudGetManyLoadingAction = CrudGetManyGenericAction<
    typeof CRUD_GET_MANY_LOADING
>;

export const CRUD_GET_MANY_FAILURE = 'RA/CRUD_GET_MANY_FAILURE';
export type CrudGetManyFailingAction = CrudGetManyGenericAction<
    typeof CRUD_GET_MANY_FAILURE
>;

export const CRUD_GET_MANY_SUCCESS = 'RA/CRUD_GET_MANY_SUCCESS';
export type CrudGetManySuccessAction = CrudGetManyGenericAction<
    typeof CRUD_GET_MANY_SUCCESS
>;
