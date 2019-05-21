import { useReducer, useEffect } from 'react';

import {
    SORT_ASC,
    SORT_DESC,
} from '../reducer/admin/resource/list/queryReducer';
import { Sort } from '../types';

const sortReducer = (state: Sort, field: string | Sort): Sort => {
    if (typeof field !== 'string') {
        return field;
    }
    const order =
        state.field === field && state.order === SORT_ASC
            ? SORT_DESC
            : SORT_ASC;
    return { field, order };
};

export default (initialSort: Sort = { field: 'id', order: 'DESC' }) => {
    const [sort, dispatch] = useReducer(sortReducer, initialSort);
    useEffect(() => dispatch(initialSort), [
        initialSort.field,
        initialSort.order,
    ]);

    return {
        sortBy: (field: string) => dispatch(field),
        sort,
    };
};
