import { useReducer, useEffect, useRef, useCallback } from 'react';

import { SORT_ASC, SORT_DESC } from './list/queryReducer';
import { SortPayload } from '../types';

export interface SortProps {
    setSortField: (field: SortPayload['field']) => void;
    setSortOrder: (order: SortPayload['order']) => void;
    setSort: (sort: SortPayload) => void;
    sort: SortPayload;
}

type Action =
    | { type: 'SET_SORT'; payload: SortPayload }
    | { type: 'SET_SORT_FIELD'; payload: SortPayload['field'] }
    | { type: 'SET_SORT_ORDER'; payload: SortPayload['order'] };

const sortReducer = (state: SortPayload, action: Action): SortPayload => {
    switch (action.type) {
        case 'SET_SORT':
            return action.payload;
        case 'SET_SORT_FIELD': {
            const field = action.payload;
            const order =
                state.field === field
                    ? state.order === SORT_ASC
                        ? SORT_DESC
                        : SORT_ASC
                    : SORT_ASC;
            return { field, order };
        }
        case 'SET_SORT_ORDER': {
            const order = action.payload;
            if (!state.field) {
                throw new Error(
                    'cannot change the order on an undefined sort field'
                );
            }
            return {
                field: state.field,
                order,
            };
        }
        default:
            return state;
    }
};

export const defaultSort = { field: '', order: 'ASC' } as const;

/**
 * Set the sort { field, order }
 * @name setSort
 * @function
 * @param {SortPayload} sort the sort object
 */

/**
 * Set the sort field, swap the order if the field is the same
 * @name setSortField
 * @function
 * @param {string} field the sort field
 */

/**
 * Set the sort order
 * @name setSortOrder
 * @function
 * @param {string} order The sort order, either ASC or DESC
 */

/**
 * @typedef SortProps
 * @type {Object}
 * @property {Object} sort: the sort object.
 * @property {string} sort.field: the sort object.
 * @property {'ASC' | 'DESC'} sort.order: the sort object.
 * @property {setSort} setSort
 * @property {setSortField} setSortField
 * @property {setSortOrder} setSortOrder
 */

/**
 * Hooks to provide sort state
 *
 * @example
 *
 * const { sort, setSort, setSortField, setSortOrder } = useSort({
 *      field: 'name',
 *      order: 'ASC',
 * });
 *
 * setSort({ field: 'name', order: 'ASC' });
 * // is the same as
 * setSortField('name');
 * setSortOrder('ASC');
 *
 * @param {Object} initialSort
 * @param {string} initialSort.field The initial sort field
 * @param {string} initialSort.order The initial sort order
 * @returns {SortProps} The sort props
 */
const useSortState = (initialSort: SortPayload = defaultSort): SortProps => {
    const [sort, dispatch] = useReducer(sortReducer, initialSort);
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        dispatch({ type: 'SET_SORT', payload: initialSort });
    }, [initialSort.field, initialSort.order]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        setSort: useCallback(
            (sort: SortPayload) =>
                dispatch({ type: 'SET_SORT', payload: sort }),
            [dispatch]
        ),
        setSortField: useCallback(
            (field: string) =>
                dispatch({ type: 'SET_SORT_FIELD', payload: field }),
            [dispatch]
        ),
        setSortOrder: useCallback(
            (order: 'ASC' | 'DESC') =>
                dispatch({ type: 'SET_SORT_ORDER', payload: order }),
            [dispatch]
        ),
        sort,
    };
};

export default useSortState;
