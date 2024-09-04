import * as React from 'react';
import { useState } from 'react';
import {
    useCanAccessCallback,
    UseCanAccessCallbackResult,
} from './useCanAccessCallback';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';

export default {
    title: 'ra-core/auth/useCanAccessCallback',
};

const UseCanAccessCallbackComponent = () => {
    const canAccess = useCanAccessCallback();

    const [result, setResult] = useState<UseCanAccessCallbackResult<Error>>();

    return (
        <div>
            <ul>
                <li>
                    <button
                        onClick={async () => {
                            const result = await canAccess({
                                resource: 'posts',
                                action: 'read',
                            });
                            setResult(result);
                        }}
                    >
                        Can I read posts
                    </button>
                </li>
                <li>
                    <button
                        onClick={async () => {
                            const result = await canAccess({
                                resource: 'posts',
                                action: 'write',
                            });
                            setResult(result);
                        }}
                    >
                        Can I write posts
                    </button>
                </li>
                <li>
                    <button
                        onClick={async () => {
                            const result = await canAccess({
                                resource: 'comments',
                                action: 'read',
                                record: {
                                    foo: 'bar',
                                },
                            });
                            setResult(result);
                        }}
                    >
                        Can I read comments
                    </button>
                </li>
            </ul>
            {result && (
                <div>
                    {result.canAccess !== undefined && (
                        <span>
                            canAccess: {result.canAccess ? 'YES' : 'NO'}
                        </span>
                    )}
                    {result.error && <span>{result.error.message}</span>}
                </div>
            )}
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
