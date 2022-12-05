import * as React from 'react';
import { useHandleAuthCallback, useTimeout } from 'ra-core';
import { Loading } from '..';
import { AuthError } from './AuthError';

/**
 * A standalone page to be used in a route called by external authentication services (e.g. OAuth)
 * after the user has been authenticated.
 *
 * Copy and adapt this component to implement your own login logic
 * (e.g. to show a different waiting screen, start onboarding procedures, etc.).
 *
 * @example
 *     import MyAuthCallbackPage from './MyAuthCallbackPage';
 *     const App = () => (
 *         <Admin authCallbackPage={MyAuthCallbackPage} authProvider={authProvider}>
 *             ...
 *        </Admin>
 *     );
 */
export const AuthCallback = () => {
    const { error } = useHandleAuthCallback();
    const hasOneSecondPassed = useTimeout(1000);

    if (error) {
        return (
            <AuthError
                message={
                    (error as Error) ? (error as Error).message : undefined
                }
            />
        );
    }

    return hasOneSecondPassed ? <Loading /> : null;
};
