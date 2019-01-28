import { GET_ONE } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';
import { RedirectionSideEffect } from '../../sideEffect/redirection';
import { RefreshSideEffect } from '../../sideEffect/refresh';

interface CrudGetOneGenericAction<T> {
    readonly type: T;
    readonly payload: {
        id: string;
    };
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

export const CRUD_GET_ONE = 'RA/CRUD_GET_ONE';
export type CrudGetOneAction = CrudGetOneGenericAction<typeof CRUD_GET_ONE>;

export const crudGetOne = (
    resource,
    id,
    basePath,
    refresh = true
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
export type CrudGetOneLoadingAction = CrudGetOneGenericAction<
    typeof CRUD_GET_ONE_LOADING
>;

export const CRUD_GET_ONE_FAILURE = 'RA/CRUD_GET_ONE_FAILURE';
export type CrudGetOneFailingAction = CrudGetOneGenericAction<
    typeof CRUD_GET_ONE_FAILURE
>;

export const CRUD_GET_ONE_SUCCESS = 'RA/CRUD_GET_ONE_SUCCESS';
export type CrudGetOneSuccessAction = CrudGetOneGenericAction<
    typeof CRUD_GET_ONE_SUCCESS
>;
