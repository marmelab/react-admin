import { DELETE_MANY } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface CrudDeleteManyGenericAction<T> {
    readonly type: T;
    readonly payload: {
        ids: [string];
    };
    readonly meta: {
        resource: string;
        fetch: typeof DELETE_MANY;
        onSuccess: {
            notification: NotificationSideEffect;
            refresh: RefreshSideEffect;
            basePath: string;
            unselectAll: boolean;
        };
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_DELETE_MANY = 'RA/CRUD_DELETE_MANY';
export type CrudDeleteManyAction = CrudDeleteManyGenericAction<
    typeof CRUD_DELETE_MANY
>;

export const crudDeleteMany = (
    resource,
    ids,
    basePath,
    refresh = true
): CrudDeleteManyAction => ({
    type: CRUD_DELETE_MANY,
    payload: { ids },
    meta: {
        resource,
        fetch: DELETE_MANY,
        onSuccess: {
            notification: {
                body: 'ra.notification.deleted',
                level: 'info',
                messageArgs: {
                    smart_count: ids.length,
                },
            },
            basePath,
            refresh,
            unselectAll: true,
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_DELETE_MANY_LOADING = 'RA/CRUD_DELETE_MANY_LOADING';
export type CrudDeleteManyLoadingAction = CrudDeleteManyGenericAction<
    typeof CRUD_DELETE_MANY_LOADING
>;

export const CRUD_DELETE_MANY_FAILURE = 'RA/CRUD_DELETE_MANY_FAILURE';
export type CrudDeleteManyFailingAction = CrudDeleteManyGenericAction<
    typeof CRUD_DELETE_MANY_FAILURE
>;

export const CRUD_DELETE_MANY_SUCCESS = 'RA/CRUD_DELETE_MANY_SUCCESS';
export type CrudDeleteManySuccessAction = CrudDeleteManyGenericAction<
    typeof CRUD_DELETE_MANY_SUCCESS
>;
