import { CREATE } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RedirectionSideEffect } from '../../sideEffect/redirection';

interface CrudCreateGenericAction<T> {
    readonly type: T;
    readonly payload: {
        data: any;
    };
    readonly meta: {
        resource: string;
        fetch: typeof CREATE;
        onSuccess: {
            notification: NotificationSideEffect;
            redirectTo: RedirectionSideEffect;
            basePath: string;
        };
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_CREATE = 'RA/CRUD_CREATE';
export type CrudCreateAction = CrudCreateGenericAction<typeof CRUD_CREATE>;

export const crudCreate = (
    resource,
    data,
    basePath,
    redirectTo = 'edit'
): CrudCreateAction => ({
    type: CRUD_CREATE,
    payload: { data },
    meta: {
        resource,
        fetch: CREATE,
        onSuccess: {
            notification: {
                body: 'ra.notification.created',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
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

export const CRUD_CREATE_LOADING = 'RA/CRUD_CREATE_LOADING';
export type CrudCreateLoadingAction = CrudCreateGenericAction<
    typeof CRUD_CREATE_LOADING
>;

export const CRUD_CREATE_FAILURE = 'RA/CRUD_CREATE_FAILURE';
export type CrudCreateFailingAction = CrudCreateGenericAction<
    typeof CRUD_CREATE_FAILURE
>;

export const CRUD_CREATE_SUCCESS = 'RA/CRUD_CREATE_SUCCESS';
export type CrudCreateSuccessAction = CrudCreateGenericAction<
    typeof CRUD_CREATE_SUCCESS
>;
