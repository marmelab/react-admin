import * as React from 'react';
import { useHandleLoginCallback, useTimeout } from 'ra-core';
import { Loading } from '..';

/**
 * A standalone page to be used in a route called by external authentication services (e.g. OAuth)
 * after the user has been authenticated.
 *
 * Copy and adapt this component to implement your own login logic
 * (e.g. to show a different waiting screen, start onboarding procedures, etc.).
 *
 * @example
 *     import MyLoginCallbackPage from './MyLoginCallbackPage';
 *     const App = () => (
 *         <Admin loginCallbackPage={MyLoginCallbackPage} authProvider={authProvider}>
 *             ...
 *        </Admin>
 *     );
 */
export const LoginCallback = () => {
    useHandleLoginCallback();
    const hasOneSecondPassed = useTimeout(1000);

    return hasOneSecondPassed ? <Loading /> : null;
};
