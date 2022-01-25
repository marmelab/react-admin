import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { unselectListItems } from '../actions';
import { Identifier } from '../types';

/**
 * Hook to Unselect the rows of a datagrid
 *
 * @example
 *
 * const unselect = useUnselect();
 * unselect('posts', [123, 456]);
 */
const useUnselectAll = () => {
    const dispatch = useDispatch();
    return useCallback(
        (resource: string, ids: Identifier[]) => {
            dispatch(unselectListItems(resource, ids));
        },
        [dispatch]
    );
};

export default useUnselectAll;
