import { createContext } from 'react';

import { AuthProvider } from '../types';

const AuthContext = createContext<AuthProvider>(() => Promise.resolve());

export default AuthContext;
