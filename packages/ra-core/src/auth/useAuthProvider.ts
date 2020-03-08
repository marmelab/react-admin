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
const useAuthProvider = (): AuthProvider => useContext(AuthContext);

export default useAuthProvider;
