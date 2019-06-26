import { createContext } from 'react';

import { AuthProvider } from '../types';

const AuthContext = createContext<AuthProvider>(() => null);

export default AuthContext;
