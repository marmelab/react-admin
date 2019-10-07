import { createContext } from 'react';

import { AuthProvider } from '../types';

const defaultProvider: AuthProvider = {
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
};

const AuthContext = createContext<AuthProvider>(defaultProvider);

AuthContext.displayName = 'AuthContext';

export default AuthContext;
