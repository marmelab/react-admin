import { useReducer, useEffect, useRef } from 'react';

import {
    SORT_ASC,
    SORT_DESC,
} from '../reducer/admin/resource/list/queryReducer';
import { Sort } from '../types';

interface SortProps {
    setSortField: (field: string) => void;
    setSort: (sort: Sort) => void;
    sort: Sort;
}

const sortReducer = (state: Sort, field: string | Sort): Sort => {
    if (typeof field !== 'string') {
        return field;
    }
    const order =
        state.field === field
            ? state.order === SORT_ASC
                ? SORT_DESC
                : SORT_ASC
            : SORT_ASC;
    return { field, order };
};

export const defaultSort = { field: 'id', order: 'DESC' };

/**
 * set the sort to the given field, swap the order if the field is the same
 * @name setSort
 * @function
 * @param {string} field the name of the field to sort
 */

/**
 * @typedef SortProps
 * @type {Object}
 * @property {Object} sort: the sort object.
 * @property {String} sort.field: the sort object.
 * @property {'ASC' | 'DESC'} sort.order: the sort object.
 * @property {setSort} setSort
 */

/**
 * Hooks to provide sort state
 *
 * @example
 *
 * const { sort, setSort } = useSort({ field: 'name',order: 'ASC' });
 *
 * @param {Object} initialSort
 * @param {string} initialSort.resource The current resource name
 * @param {string} initialSort.reference The linked resource name
 * @returns {SortProps} The sort props
 */
export default (initialSort: Sort = defaultSort): SortProps => {
    const [sort, dispatch] = useReducer(sortReducer, initialSort);
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        dispatch(initialSort);
    }, [initialSort.field, initialSort.order]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        setSort: (sortValue: Sort) => dispatch(sortValue),
        setSortField: (field: string) => dispatch(field),
        sort,
    };
};
