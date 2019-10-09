import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import { UserManager } from 'oidc-client';

import getProfileFromToken from './getProfileFromToken'

const issuer = 'https://accounts.google.com/';
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const apiUri = process.env.REACT_APP_API_URL;

const userManager = new UserManager({
    authority: issuer,
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile', // Allow to retrieve the email and user name later api side
});

const cleanup = () => {
    // Remove the ?code&state from the URL
    window.history.replaceState(
        {},
        window.document.title,
        window.location.origin
    );
}

const authProvider = async (type, params = {}) => {
    if (type === AUTH_LOGIN) {
        // 1. Redirect to the issuer to ask authentication
        if (!params.code || !params.state) {
            userManager.signinRedirect();
            return; // Do not return anything, the login is still loading
        }

        // 2. We came back from the issuer with ?code infos in query params

        // oidc-client uses localStorage to keep a temporary state
        // between the two redirections. But since we need to send it to the API
        // we have to retrieve it manually
        const stateKey = `oidc.${params.state}`;
        const { code_verifier } = JSON.parse(
            localStorage.getItem(stateKey) || '{}'
        );

        // Transform the code to a token via the API
        const response = await fetch(`${apiUri}/code-to-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: params.code, code_verifier }),
        });

        if (!response.ok) {
            cleanup();
            return Promise.reject();
        }

        const token = await response.json();

        localStorage.setItem('token', JSON.stringify(token));
        userManager.clearStaleState();
        cleanup();
        return Promise.resolve();
    }

    if ([AUTH_LOGOUT, AUTH_ERROR].includes(type)) {
        localStorage.removeItem('token');
        return Promise.resolve();
    }

    if (type === AUTH_CHECK) {
        const token = localStorage.getItem('token');

        if (!token) {
            return Promise.reject()
        }

        // This is specific to the Google authentication implementation
        const jwt = getProfileFromToken(token);
        const now = new Date();

        return now.getTime() > (jwt.exp * 1000) ? Promise.reject() : Promise.resolve()
    }

    return Promise.resolve();
}

export default authProvider;
