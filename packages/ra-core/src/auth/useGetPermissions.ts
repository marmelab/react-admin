import { useCallback } from 'react';
import { useStore } from 'react-redux';
import { Location } from 'history';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { AUTH_GET_PERMISSIONS } from './types';

/**
 * Get a callback for calling the authProvider with the AUTH_GET_PERMISSIONS verb.
 *
 * @see useAuthProvider
 * @param {Object} authParams Any params you want to pass to the authProvider
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
const useGetPermissions = (
    authParams: any = defaultAuthParams
): GetPermissions => {
    const authProvider = useAuthProvider();
    /**
     * We need the current location to pass to the authProvider for GET_PERMISSIONS.
     *
     * But if we used useSelector to read it from the store, the getPermissions function
     * would be rebuilt each time the user changes location. Consequently, that
     * would force a rerender of the enclosing component upon navigation.
     *
     * To avoid that, we don't subscribe to the store using useSelector;
     * instead, we get a pointer to the store, and determine the location only
     * after the getPermissions function was called.
     */

    const store = useStore();

    const getPermissions = useCallback(
        (location?: Location) =>
            authProvider(AUTH_GET_PERMISSIONS, {
                location: location || store.getState().router.location,
                ...authParams,
            }),
        [authParams, authProvider, store]
    );

    return authProvider ? getPermissions : getPermissionsWithoutProvider;
};

const getPermissionsWithoutProvider = () => Promise.resolve([]);

/**
 * Ask the permissions to the  authProvider using the AUTH_GET_PERMISSIONS verb
 *
 * @param {Location} location the current location from history (optional)
 *
 * @return {Promise} The authProvider response
 */
type GetPermissions = (location?: Location) => Promise<any>;

export default useGetPermissions;
