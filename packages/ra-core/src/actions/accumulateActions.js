import { crudGetMany, crudGetMatching } from './dataActions';

export const CRUD_GET_MANY_ACCUMULATE = 'RA/CRUD_GET_MANY_ACCUMULATE';

export const crudGetManyAccumulate = (resource, ids) => ({
    type: CRUD_GET_MANY_ACCUMULATE,
    payload: { resource, ids },
    meta: { accumulate: (resource, ids) => crudGetMany(resource, ids) },
});

export const CRUD_GET_MATCHING_DEBOUNCE = 'RA/CRUD_GET_MATCHING_DEBOUNCE';

export const crudGetMatchingDebounce = (
    reference,
    relatedTo,
    pagination,
    sort,
    filter
) => {
    const action = crudGetMatching(
        reference,
        relatedTo,
        pagination,
        sort,
        filter
    );

    return {
        type: CRUD_GET_MATCHING_DEBOUNCE,
        meta: {
            accumulate: () => action,
            accumulateValues: () => true,
            accumulateKey: JSON.stringify({
                resource: reference,
                ...action.payload,
            }),
        },
    };
};
