import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setListSelectedIds } from '../actions';

/**
 * Hook for Unselect All Side Effect
 *
 * @example
 *
 * const unselectAll = useUnselectAll('posts');
 * unselectAll();
 */
const useUnselectAll = resource1 => {
    const dispatch = useDispatch();
    return useCallback(
        resource2 => dispatch(setListSelectedIds(resource2 || resource1, [])),
        [dispatch, resource1]
    );
};

export default useUnselectAll;
