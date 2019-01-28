import { GET_MANY_REFERENCE } from '../../dataFetchActions';
import { NotificationSideEffect } from '../../sideEffect/notification';

interface CrudGetManyReferenceGenericAction<T> {
    readonly type: T;
    readonly payload: {
        source: string;
        target: string;
        id: string;
        pagination: { page: number; perPage: number };
        sort: { field: string; order: string };
        filter: object;
    };
    readonly meta: {
        resource: string;
        fetch: typeof GET_MANY_REFERENCE;
        relatedTo: string;
        onFailure: {
            notification: NotificationSideEffect;
        };
    };
}

export const CRUD_GET_MANY_REFERENCE = 'RA/CRUD_GET_MANY_REFERENCE';
export type CrudGetManyReferenceAction = CrudGetManyReferenceGenericAction<
    typeof CRUD_GET_MANY_REFERENCE
>;

export const crudGetManyReference = (
    reference,
    target,
    id,
    relatedTo,
    pagination,
    sort,
    filter,
    source
): CrudGetManyReferenceAction => ({
    type: CRUD_GET_MANY_REFERENCE,
    payload: { target, id, pagination, sort, filter, source },
    meta: {
        resource: reference,
        relatedTo,
        fetch: GET_MANY_REFERENCE,
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
});

export const CRUD_GET_MANY_REFERENCE_LOADING =
    'RA/CRUD_GET_MANY_REFERENCE_LOADING';
export type CrudGetManyReferenceLoadingAction = CrudGetManyReferenceGenericAction<
    typeof CRUD_GET_MANY_REFERENCE_LOADING
>;

export const CRUD_GET_MANY_REFERENCE_FAILURE =
    'RA/CRUD_GET_MANY_REFERENCE_FAILURE';
export type CrudGetManyReferenceFailingAction = CrudGetManyReferenceGenericAction<
    typeof CRUD_GET_MANY_REFERENCE_FAILURE
>;

export const CRUD_GET_MANY_REFERENCE_SUCCESS =
    'RA/CRUD_GET_MANY_REFERENCE_SUCCESS';
export type CrudGetManyReferenceSuccessAction = CrudGetManyReferenceGenericAction<
    typeof CRUD_GET_MANY_REFERENCE_SUCCESS
>;
