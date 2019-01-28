import { UPDATE_MANY } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface CrudUpdateManyGenericAction<T> {
    readonly type: T;
    readonly payload: {
        ids: [string];
        data: any;
    };
    readonly meta: {
        resource: string;
        fetch: typeof UPDATE_MANY;
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

export const CRUD_UPDATE_MANY = 'RA/CRUD_UPDATE_MANY';
export type CrudUpdateManyAction = CrudUpdateManyGenericAction<
    typeof CRUD_UPDATE_MANY
>;

export const crudUpdateMany = (
    resource,
    ids,
    data,
    basePath,
    refresh = true
): CrudUpdateManyAction => ({
    type: CRUD_UPDATE_MANY,
    payload: { ids, data },
    meta: {
        resource,
        fetch: UPDATE_MANY,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
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

export const CRUD_UPDATE_MANY_LOADING = 'RA/CRUD_UPDATE_MANY_LOADING';
export type CrudUpdateManyLoadingAction = CrudUpdateManyGenericAction<
    typeof CRUD_UPDATE_MANY_LOADING
>;

export const CRUD_UPDATE_MANY_FAILURE = 'RA/CRUD_UPDATE_MANY_FAILURE';
export type CrudUpdateManyFailingAction = CrudUpdateManyGenericAction<
    typeof CRUD_UPDATE_MANY_FAILURE
>;

export const CRUD_UPDATE_MANY_SUCCESS = 'RA/CRUD_UPDATE_MANY_SUCCESS';
export type CrudUpdateManySuccessAction = CrudUpdateManyGenericAction<
    typeof CRUD_UPDATE_MANY_SUCCESS
>;
