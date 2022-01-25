import { useIsFetching, useIsMutating } from 'react-query';

/**
 * Get the loading status, i.e. a boolean indicating if at least one request is pending
 *
 * @see useLoad
 *
 * @example
 *
 * import { useLoading } from 'react-admin';
 *
 * const MyComponent = () => {
 *      const loading = useLoading();
 *      return loading ? <Skeleton /> : <RealContent>;
 * }
 */
export const useLoading = () => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    return isFetching > 0 || isMutating > 0;
};
