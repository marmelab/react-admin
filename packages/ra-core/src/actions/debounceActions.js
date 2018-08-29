import { crudGetMatching } from './dataActions';

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
            debouncedAction: action,
            debounceKey: JSON.stringify(action.payload),
        },
    };
};
