import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { refreshView } from '../actions/uiActions';

/**
 * Hook for Refresh Side Effect
 *
 * @example
 *
 * const refresh = useRefresh();
 * refresh();
 */
const useRefresh = () => {
    const dispatch = useDispatch();
    return useCallback(
        (doRefresh = true) => doRefresh && dispatch(refreshView()),
        [dispatch]
    );
};

export default useRefresh;
