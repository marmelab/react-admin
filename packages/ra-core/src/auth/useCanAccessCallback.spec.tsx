import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import useCanAccessCallback from './useCanAccessCallback';
import { QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const UseCanAccessCallback = ({ children }: { children: any }) => {
    const canAccess = useCanAccessCallback();

    return children(canAccess);
};

const StateInpector = canAccess => {
    const [result, setResult] = useState<any>();

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
                    <span>{result.isPending && 'LOADING'}</span>
                    {result.isAccessible !== undefined && (
                        <span>
                            isAccessible: {result.isAccessible ? 'YES' : 'NO'}
                        </span>
                    )}
                    <span>{result.error && 'ERROR'}</span>
                </div>
            )}
        </div>
    );
};

describe('useCanAccess', () => {
    it('should return a function allowing to call authProvider.canAccess', async () => {
        const canAccess = jest.fn().mockResolvedValue(true);
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess,
        };
        const screen = render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccessCallback>{StateInpector}</UseCanAccessCallback>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Can I read posts'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'posts',
                action: 'read',
            });
        });

        fireEvent.click(screen.getByText('Can I write posts'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'posts',
                action: 'write',
            });
        });

        fireEvent.click(screen.getByText('Can I read comments'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'comments',
                action: 'read',
                record: {
                    foo: 'bar',
                },
            });
        });
        expect(canAccess).toBeCalledTimes(3);
    });
});
