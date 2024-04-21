import { useEffect } from 'react';
import useLogout from './useLogout';

/**
 * Log the user out and redirect them to login.
 *
 * To be used as a catch-all route for anonymous users in a secure app.
 *
 * @see CoreAdminRoutes
 */
export const LogoutOnMount = () => {
    const logout = useLogout();
    useEffect(() => {
        logout();
    }, [logout]);
    return null;
};
