import { Identifier, Record } from '../../types';
import { DELETE } from '../../dataFetchActions';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';
import {
    NotificationSideEffect,
    RedirectionSideEffect,
    RefreshSideEffect,
} from '../../sideEffect';

export const crudDelete = (
    resource: string,
    id: Identifier,
    previousData: Record,
    basePath: string,
    redirectTo: RedirectionSideEffect = 'list',
    refresh: RefreshSideEffect = true
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

interface RequestPayload {
    id: Identifier;
    previousData: Record;
}

export const CRUD_DELETE = 'RA/CRUD_DELETE';
export interface CrudDeleteAction {
    readonly type: typeof CRUD_DELETE;
    readonly payload: RequestPayload;
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

export const CRUD_DELETE_LOADING = 'RA/CRUD_DELETE_LOADING';
export interface CrudDeleteLoadingAction {
    readonly type: typeof CRUD_DELETE_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
    };
}

export const CRUD_DELETE_FAILURE = 'RA/CRUD_DELETE_FAILURE';
export interface CrudDeleteFailureAction {
    readonly type: typeof CRUD_DELETE_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        fetchResponse: typeof CRUD_DELETE;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_DELETE_SUCCESS = 'RA/CRUD_DELETE_SUCCESS';
export interface CrudDeleteSuccessAction {
    readonly type: typeof CRUD_DELETE_SUCCESS;
    readonly payload: {
        data: Record;
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        redirectTo: RedirectionSideEffect;
        refresh: RefreshSideEffect;
        basePath: string;
        fetchResponse: typeof CRUD_DELETE;
        fetchStatus: typeof FETCH_END;
    };
}
