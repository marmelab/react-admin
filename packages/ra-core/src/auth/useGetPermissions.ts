import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Location } from 'history';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { AUTH_GET_PERMISSIONS } from './types';
import { ReduxState } from '../types';

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
    const currentLocation = useSelector(
        (state: ReduxState) => state.router.location
    );

    const getPermissions = useCallback(
        (location: Location = currentLocation) =>
            authProvider(AUTH_GET_PERMISSIONS, { location, ...authParams }),
        [authParams, authProvider, currentLocation]
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
