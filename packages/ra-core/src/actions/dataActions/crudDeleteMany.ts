import { Identifier, Record } from '../../types';
import { DELETE_MANY } from '../../dataFetchActions';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface RequestPayload {
    ids: Identifier[];
}

export const CRUD_DELETE_MANY = 'RA/CRUD_DELETE_MANY';
export interface CrudDeleteManyAction {
    readonly type: typeof CRUD_DELETE_MANY;
    readonly payload: RequestPayload;
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
export const crudDeleteMany = (
    resource: string,
    ids: Identifier[],
    basePath: string,
    refresh: RefreshSideEffect = true
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
export interface CrudDeleteManyLoadingAction {
    readonly type: typeof CRUD_DELETE_MANY_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
    };
}

export const CRUD_DELETE_MANY_FAILURE = 'RA/CRUD_DELETE_MANY_FAILURE';
export interface CrudDeleteMAnyFailureAction {
    readonly type: typeof CRUD_DELETE_MANY_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        fetchResponse: typeof DELETE_MANY;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_DELETE_MANY_SUCCESS = 'RA/CRUD_DELETE_MANY_SUCCESS';
export interface CrudDeleteManySuccessAction {
    readonly type: typeof CRUD_DELETE_MANY_SUCCESS;
    readonly payload: {
        data: Record[];
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        refresh: RefreshSideEffect;
        basePath: string;
        unselectAll: boolean;
        fetchResponse: typeof DELETE_MANY;
        fetchStatus: typeof FETCH_END;
    };
}
