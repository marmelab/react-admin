import { useContext } from 'react';

import { AuthProvider } from '../types';
import AuthContext from './AuthContext';

export const defaultAuthParams = {
    loginUrl: '/login',
    afterLoginUrl: '/',
};

/**
 * Get the authProvider stored in the context
 */
const useAuthProvider = <
    AuthProviderType extends AuthProvider = AuthProvider
>(): AuthProviderType => useContext(AuthContext) as AuthProviderType;

export default useAuthProvider;
