import { GET_LIST } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';

interface CrudGetMatchingGenericAction<T> {
    readonly type: T;
    readonly payload: {
        pagination: { page: number; perPage: number };
        sort: { field: string; order: string };
        filter: object;
    };
    readonly meta: {
        resource: string;
        fetch: typeof GET_LIST;
        relatedTo: string;
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_GET_MATCHING = 'RA/CRUD_GET_MATCHING';
export type CrudGetMatchingAction = CrudGetMatchingGenericAction<
    typeof CRUD_GET_MATCHING
>;

export const crudGetMatching = (
    reference,
    relatedTo,
    pagination,
    sort,
    filter
): CrudGetMatchingAction => ({
    type: CRUD_GET_MATCHING,
    payload: { pagination, sort, filter },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_LIST,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_MATCHING_LOADING = 'RA/CRUD_GET_MATCHING_LOADING';
export type CrudGetMatchingLoadingAction = CrudGetMatchingGenericAction<
    typeof CRUD_GET_MATCHING_LOADING
>;

export const CRUD_GET_MATCHING_FAILURE = 'RA/CRUD_GET_MATCHING_FAILURE';
export type CrudGetMatchingFailingAction = CrudGetMatchingGenericAction<
    typeof CRUD_GET_MATCHING_FAILURE
>;

export const CRUD_GET_MATCHING_SUCCESS = 'RA/CRUD_GET_MATCHING_SUCCESS';
export type CrudGetMatchingSuccessAction = CrudGetMatchingGenericAction<
    typeof CRUD_GET_MATCHING_SUCCESS
>;
