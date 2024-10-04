import { useCallback } from 'react';

import useAuthProvider from './useAuthProvider';

/**
 * Get a callback for calling the authProvider.getPermissions() method.
 *
 * @see useAuthProvider
 *
 * @returns {Function} getPermissions callback
 *
 * This is a low level hook. See those more specialized hooks
 * offering state handling.
 *
 * @see usePermissions
 *
 * @example
 *
 * import { useGetPermissions } from 'react-admin';
 *
 * const Roles = () => {
 *     const [permissions, setPermissions] = useState([]);
 *     const getPermissions = useGetPermissions();
 *     useEffect(() => {
 *         getPermissions().then(permissions => setPermissions(permissions))
 *     }, [])
 *     return (
 *         <ul>
 *             {permissions.map((permission, key) => (
 *                 <li key={key}>{permission}</li>
 *             ))}
 *         </ul>
 *     );
 * }
 */
const useGetPermissions = (): GetPermissions => {
    const authProvider = useAuthProvider();
    const getPermissions = useCallback(
        (params: any = {}) => {
            // react-query requires the query to return something
            if (authProvider && authProvider.getPermissions) {
                return authProvider
                    .getPermissions(params)
                    .then(result => result ?? null);
            }
            return Promise.resolve([]);
        },
        [authProvider]
    );

    return getPermissions;
};

/**
 * Proxy for calling authProvider.getPermissions()
 *
 * @param {Object} params The parameters to pass to the authProvider
 *
 * @return {Promise} The authProvider response
 */
type GetPermissions = (params?: any) => Promise<any>;

export default useGetPermissions;
