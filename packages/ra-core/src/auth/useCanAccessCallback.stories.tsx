import * as React from 'react';
import { useState } from 'react';
import { useCanAccessCallback } from './useCanAccessCallback';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';

export default {
    title: 'ra-core/auth/useCanAccessCallback',
};

const UseCanAccessCallbackComponent = () => {
    const checkAccess = useCanAccessCallback();

    const [canAccess, setCanAccess] = useState<boolean>();
    const [error, setError] = useState<Error>();

    return (
        <div>
            <ul>
                <li>
                    <button
                        onClick={async () => {
                            try {
                                const canAccess = await checkAccess({
                                    resource: 'posts',
                                    action: 'read',
                                });
                                setCanAccess(canAccess);
                            } catch (e) {
                                setError(e as Error);
                            }
                        }}
                    >
                        Can I read posts
                    </button>
                </li>
                <li>
                    <button
                        onClick={async () => {
                            try {
                                const canAccess = await checkAccess({
                                    resource: 'posts',
                                    action: 'write',
                                });
                                setCanAccess(canAccess);
                            } catch (e) {
                                setError(e as Error);
                            }
                        }}
                    >
                        Can I write posts
                    </button>
                </li>
                <li>
                    <button
                        onClick={async () => {
                            try {
                                const canAccess = await checkAccess({
                                    resource: 'comments',
                                    action: 'read',
                                    record: {
                                        foo: 'bar',
                                    },
                                });
                                setCanAccess(canAccess);
                            } catch (e) {
                                setError(e as Error);
                            }
                        }}
                    >
                        Can I read comments
                    </button>
                </li>
            </ul>
            {canAccess !== undefined && (
                <div>
                    <span>canAccess: {canAccess ? 'YES' : 'NO'}</span>
                </div>
            )}
            {error && <span>{error.message}</span>}
        </div>
    );
};

const defaultAuthProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.reject('bad method'),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.reject('bad method'),
    canAccess: ({ action }) => Promise.resolve(action === 'read'),
};

export const Basic = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider | null;
}) => (
    <CoreAdminContext
        authProvider={authProvider != null ? authProvider : undefined}
    >
        <UseCanAccessCallbackComponent />
    </CoreAdminContext>
);

const defaultErrorAuthProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.reject('bad method'),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.reject('bad method'),
    canAccess: () => Promise.reject(new Error('uh oh, something went wrong')),
};

export const WithError = ({
    authProvider = defaultErrorAuthProvider,
}: {
    authProvider?: AuthProvider | null;
}) => (
    <CoreAdminContext
        authProvider={authProvider != null ? authProvider : undefined}
    >
        <UseCanAccessCallbackComponent />
    </CoreAdminContext>
);
