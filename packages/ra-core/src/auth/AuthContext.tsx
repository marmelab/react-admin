import { createContext } from 'react';

import { AuthProvider } from '../types';

const AuthContext = createContext<AuthProvider>(() => Promise.resolve());

AuthContext.displayName = 'AuthContext';

export default AuthContext;
