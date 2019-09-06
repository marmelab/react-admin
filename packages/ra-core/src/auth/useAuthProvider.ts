import { useContext } from 'react';

import AuthContext from './AuthContext';

export const defaultAuthParams = {
    loginUrl: '/login',
    afterLoginUrl: '/',
};

const useAuthProvider = () => useContext(AuthContext);

export default useAuthProvider;
