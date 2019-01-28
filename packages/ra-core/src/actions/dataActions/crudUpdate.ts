import { UPDATE } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RedirectionSideEffect } from '../../sideEffect/redirection';

interface CrudUpdateGenericAction<T> {
    readonly type: T;
    readonly payload: {
        id: string;
        data: any;
        previousData?: any;
    };
    readonly meta: {
        resource: string;
        fetch: typeof UPDATE;
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

export const CRUD_UPDATE = 'RA/CRUD_UPDATE';
export type CrudUpdateAction = CrudUpdateGenericAction<typeof CRUD_UPDATE>;

export const crudUpdate = (
    resource,
    id,
    data,
    previousData,
    basePath,
    redirectTo = 'show'
): CrudUpdateAction => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData },
    meta: {
        resource,
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: 'ra.notification.updated',
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

export const CRUD_UPDATE_LOADING = 'RA/CRUD_UPDATE_LOADING';
export type CrudUpdateLoadingAction = CrudUpdateGenericAction<
    typeof CRUD_UPDATE_LOADING
>;

export const CRUD_UPDATE_FAILURE = 'RA/CRUD_UPDATE_FAILURE';
export type CrudUpdateFailingAction = CrudUpdateGenericAction<
    typeof CRUD_UPDATE_FAILURE
>;

export const CRUD_UPDATE_SUCCESS = 'RA/CRUD_UPDATE_SUCCESS';
export type CrudUpdateSuccessAction = CrudUpdateGenericAction<
    typeof CRUD_UPDATE_SUCCESS
>;
