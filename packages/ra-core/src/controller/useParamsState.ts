import { useReducer, useEffect, useRef, useCallback } from 'react';

import queryReducer, { SORT_ASC, SORT_DESC } from './list/queryReducer';
import { ParamsPayload, SortPayload } from '../types';

export interface ParamsProps {
    setParams: (field: SortPayload['field']) => void;
}

type Action = { type: 'SET_PARAMS'; payload: SortPayload };

const paramsReducer = (state: SortPayload, action: Action): SortPayload => {
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

export const defaultParams = {
    page: 1,
    perPage: 25,
    sort: { field: '', order: 'ASC' } as const,
};

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
const useParamsState = (
    initialParams: ParamsPayload = defaultParams
): SortProps => {
    const [params, dispatch] = useReducer(queryReducer, initialParams);
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        dispatch({ type: 'SET_SORT', payload: initialSort });
    }, [initialSort.field, initialSort.order]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        setParams: useCallback(
            (sort: SortPayload) =>
                dispatch({ type: 'SET_PARAMS', payload: sort }),
            [dispatch]
        ),
    };
};

export default useParamsState;
