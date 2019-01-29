import { Identifier, Record } from '../../types';
import { GET_ONE } from '../../dataFetchActions';
import { FETCH_END, FETCH_ERROR } from '../fetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RedirectionSideEffect } from '../../sideEffect/redirection';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface RequestPayload {
    id: Identifier;
}

export const CRUD_GET_ONE = 'RA/CRUD_GET_ONE';
export interface CrudGetOneAction {
    readonly type: typeof CRUD_GET_ONE;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof GET_ONE;
        basePath: string;
        onFailure: {
            notification: NotificationSideEffect;
            redirectTo: RedirectionSideEffect;
            refresh: RefreshSideEffect;
        };
    };
}

export const crudGetOne = (
    resource: string,
    id: Identifier,
    basePath: string,
    refresh: boolean = true
): CrudGetOneAction => ({
    type: CRUD_GET_ONE,
    payload: { id },
    meta: {
        resource,
        fetch: GET_ONE,
        basePath,
        onFailure: {
            notification: {
                body: 'ra.notification.item_doesnt_exist',
                level: 'warning',
            },
            redirectTo: 'list',
            refresh,
        },
    },
});

export const CRUD_GET_ONE_LOADING = 'RA/CRUD_GET_ONE_LOADING';
export interface CrudGetOneLoadingAction {
    readonly type: typeof CRUD_GET_ONE_LOADING;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        basePath: string;
    };
}

export const CRUD_GET_ONE_FAILURE = 'RA/CRUD_GET_ONE_FAILURE';
export interface CrudGetOneFailureAction {
    readonly type: typeof CRUD_GET_ONE_FAILURE;
    readonly error: string | object;
    readonly payload: string;
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        notification: NotificationSideEffect;
        redirectTo: RedirectionSideEffect;
        refresh: RefreshSideEffect;
        fetchResponse: typeof GET_ONE;
        fetchStatus: typeof FETCH_ERROR;
    };
}

export const CRUD_GET_ONE_SUCCESS = 'RA/CRUD_GET_ONE_SUCCESS';
export interface CrudGetOneSuccessAction {
    readonly type: typeof CRUD_GET_ONE_SUCCESS;
    readonly payload: {
        data: Record;
    };
    readonly requestPayload: RequestPayload;
    readonly meta: {
        resource: string;
        fetchResponse: typeof GET_ONE;
        fetchStatus: typeof FETCH_END;
    };
}
