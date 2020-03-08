import Authenticated from './Authenticated';
import AuthContext from './AuthContext';
import useAuthProvider from './useAuthProvider';
import useAuthState from './useAuthState';
import usePermissions from './usePermissions';
import useAuthenticated from './useAuthenticated';
import WithPermissions from './WithPermissions';
import useLogin from './useLogin';
import useLogout from './useLogout';
import useCheckAuth from './useCheckAuth';
import useGetPermissions from './useGetPermissions';
import useLogoutIfAccessDenied from './useLogoutIfAccessDenied';
import convertLegacyAuthProvider from './convertLegacyAuthProvider';
export * from './types';

export {
    AuthContext,
    useAuthProvider,
    convertLegacyAuthProvider,
    // low-vevel hooks for calling a particular verb on the authProvider
    useLogin,
    useLogout,
    useCheckAuth,
    useGetPermissions,
    // hooks with state management
    usePermissions,
    useAuthState,
    // hook with immediate effect
    useAuthenticated,
    useLogoutIfAccessDenied,
    // components
    Authenticated,
    WithPermissions,
};
