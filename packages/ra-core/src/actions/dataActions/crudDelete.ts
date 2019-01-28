import { DELETE } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RedirectionSideEffect } from '../../sideEffect/redirection';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface CrudDeleteGenericAction<T> {
    readonly type: T;
    readonly payload: {
        id: string;
        previousData: any;
    };
    readonly meta: {
        resource: string;
        fetch: typeof DELETE;
        onSuccess: {
            notification: NotificationSideEffect;
            redirectTo: RedirectionSideEffect;
            refresh: RefreshSideEffect;
            basePath: string;
        };
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_DELETE = 'RA/CRUD_DELETE';
export type CrudDeleteAction = CrudDeleteGenericAction<typeof CRUD_DELETE>;

export const crudDelete = (
    resource,
    id,
    previousData,
    basePath,
    redirectTo = 'list',
    refresh = true
): CrudDeleteAction => ({
    type: CRUD_DELETE,
    payload: { id, previousData },
    meta: {
        resource,
        fetch: DELETE,
        onSuccess: {
            notification: {
                body: 'ra.notification.deleted',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            refresh,
            redirectTo,
            basePath,
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_DELETE_LOADING = 'RA/CRUD_DELETE_LOADING';
export type CrudDeleteLoadingAction = CrudDeleteGenericAction<
    typeof CRUD_DELETE_LOADING
>;

export const CRUD_DELETE_FAILURE = 'RA/CRUD_DELETE_FAILURE';
export type CrudDeleteFailingAction = CrudDeleteGenericAction<
    typeof CRUD_DELETE_FAILURE
>;

export const CRUD_DELETE_SUCCESS = 'RA/CRUD_DELETE_SUCCESS';
export type CrudDeleteSuccessAction = CrudDeleteGenericAction<
    typeof CRUD_DELETE_SUCCESS
>;
