import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { fetchStart, fetchEnd } from '../actions/fetchActions';

/**
 * Update the loading count, which starts or stops the loading indicator.
 *
 * To be used to show the loading indicator when you don't use the dataProvider.
 *
 * @return {Object} startLoading and stopLoading callbacks
 *
 * @example
 * import { useUpdateLoading } from 'react-admin'
 *
 * const MyComponent = () => {
 *      const { startLoading, stopLoading } = useUpdateLoading();
 *      useEffect(() => {
 *          startLoading();
 *          fetch('http://my.domain.api/foo')
 *              .finally(() => stopLoading());
 *      }, []);
 *      return <span>Foo</span>;
 * }
 */
export default () => {
    const dispatch = useDispatch();

    const startLoading = useCallback(() => {
        dispatch(fetchStart());
    }, [dispatch]);

    const stopLoading = useCallback(() => {
        dispatch(fetchEnd());
    }, [dispatch]);

    return { startLoading, stopLoading };
};
