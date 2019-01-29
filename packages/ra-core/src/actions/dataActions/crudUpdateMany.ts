import { Identifier, Record } from '../../types';
import { UPDATE_MANY } from '../../dataFetchActions';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface RequestPayload {
    ids: Identifier[];
    data: any;
}

export const CRUD_UPDATE_MANY = 'RA/CRUD_UPDATE_MANY';
export interface CrudUpdateManyAction {
    readonly type: typeof CRUD_UPDATE_MANY;
    readonly payload: RequestPayload;
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

export const crudUpdateMany = (
    resource: string,
    ids: Identifier[],
    data: any,
    basePath: string,
    refresh: RefreshSideEffect = true
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
export interface CrudUpdateManyLoadingAction {
    readonly type: typeof CRUD_UPDATE_MANY_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
    };
}

export const CRUD_UPDATE_MANY_FAILURE = 'RA/CRUD_UPDATE_MANY_FAILURE';
export interface CrudUpdateManyFailureAction {
    readonly type: typeof CRUD_UPDATE_MANY_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        fetchResponse: typeof UPDATE_MANY;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_UPDATE_MANY_SUCCESS = 'RA/CRUD_UPDATE_MANY_SUCCESS';
export interface CrudUpdateManySuccessAction {
    readonly type: typeof CRUD_UPDATE_MANY_SUCCESS;
    readonly payload: {
        data: Identifier[];
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        refresh: RefreshSideEffect;
        basePath: string;
        unselectAll: boolean;
        fetchResponse: typeof UPDATE_MANY;
        fetchStatus: typeof FETCH_END;
    };
}
