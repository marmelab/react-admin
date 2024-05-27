import { createContext } from 'react';

import { AuthProvider } from '../types';

export const AuthContext = createContext<AuthProvider | undefined>(undefined);

AuthContext.displayName = 'AuthContext';
