import { crudGetMany, crudGetMatching } from './dataActions';

export const CRUD_GET_MANY_ACCUMULATE = 'RA/CRUD_GET_MANY_ACCUMULATE';

export const crudGetManyAccumulate = (
    resource: string,
    ids: []
): {
    type: string;
    payload: {
        resource: string;
        ids: [];
    };
    meta: {
        accumulate: any;
    };
} => ({
    type: CRUD_GET_MANY_ACCUMULATE,
    payload: { resource, ids },
    meta: { accumulate: crudGetMany },
});

export const CRUD_GET_MATCHING_ACCUMULATE = 'RA/CRUD_GET_MATCHING_ACCUMULATE';

export const crudGetMatchingAccumulate = (
    reference: string,
    relatedTo: string,
    pagination: object,
    sort: object,
    filter: object
): {
    type: string;
    meta: {
        accumulate: any;
        accumulateValues: () => boolean;
        accumulateKey: string;
    };
} => {
    const action = crudGetMatching(
        reference,
        relatedTo,
        pagination,
        sort,
        filter
    );

    return {
        type: CRUD_GET_MATCHING_ACCUMULATE,
        meta: {
            accumulate: () => action,
            accumulateValues: () => true,
            accumulateKey: JSON.stringify({
                resource: reference,
                relatedTo,
                ...action.payload,
            }),
        },
    };
};
