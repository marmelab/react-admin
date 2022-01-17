import Authenticated, { AuthenticatedProps } from './Authenticated';
import AuthContext from './AuthContext';
import useAuthProvider from './useAuthProvider';
import useAuthState from './useAuthState';
import usePermissions from './usePermissions';
import usePermissionsOptimized from './usePermissionsOptimized';
import WithPermissions, { WithPermissionsProps } from './WithPermissions';
import useLogin from './useLogin';
import useLogout from './useLogout';
import useGetIdentity from './useGetIdentity';
import useGetPermissions from './useGetPermissions';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import convertLegacyAuthProvider from './convertLegacyAuthProvider';

export * from './types';
export * from './useAuthenticated';
export * from './useCheckAuth';

export {
    AuthContext,
    useAuthProvider,
    convertLegacyAuthProvider,
    // low-level hooks for calling a particular verb on the authProvider
    useLogin,
    useLogout,
    useGetIdentity,
    useGetPermissions,
    // hooks with state management
    usePermissions,
    usePermissionsOptimized,
    useAuthState,
    // hook with immediate effect
    useLogoutIfAccessDenied,
    // components
    Authenticated,
    WithPermissions,
};

export type { AuthenticatedProps, WithPermissionsProps };
