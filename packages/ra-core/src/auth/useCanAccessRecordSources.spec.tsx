import * as React from 'react';
import expect from 'expect';
import { waitFor, render } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import useCanAccessRecordSources from './useCanAccessRecordSources';

const UseCanAccessRecordSources = ({
    children,
    action,
    resource,
    sources,
}: {
    children: any;
    action: string;
    resource: string;
    sources: string[];
}) => {
    const { canAccess, isPending } = useCanAccessRecordSources({
        action,
        resource,
        sources,
    });

    return children({ canAccess, isPending });
};

const StateInpector = result => {
    return <div>{JSON.stringify(result)}</div>;
};

describe('useCanAccessRecordSources', () => {
    it('should call authProvider.canAccess for every resource sources', async () => {
        const canAccess = jest.fn().mockImplementation(async () => true);
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
                <UseCanAccessRecordSources
                    action="read"
                    resource="posts"
                    sources={['id', 'title', 'author']}
                >
                    {StateInpector}
                </UseCanAccessRecordSources>
            </CoreAdminContext>
        );

        expect(
            screen.getByText(JSON.stringify({ canAccess: {}, isPending: true }))
        );

        expect(canAccess).toBeCalledTimes(3);
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.id',
            signal: expect.any(AbortSignal),
        });
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.title',
            signal: expect.any(AbortSignal),
        });
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.author',
            signal: expect.any(AbortSignal),
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    JSON.stringify({
                        canAccess: { id: true, title: true, author: true },
                        isPending: false,
                    })
                )
            );
        });
    });

    it('should grant access to each sources based on canAccess result', async () => {
        const canAccess = jest
            .fn()
            .mockImplementation(
                async ({ resource }) => resource !== 'posts.id'
            );
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
                <UseCanAccessRecordSources
                    action="read"
                    resource="posts"
                    sources={['id', 'title', 'author']}
                >
                    {StateInpector}
                </UseCanAccessRecordSources>
            </CoreAdminContext>
        );

        expect(
            screen.getByText(JSON.stringify({ canAccess: {}, isPending: true }))
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    JSON.stringify({
                        canAccess: { id: false, title: true, author: true },
                        isPending: false,
                    })
                )
            );
        });
    });

    it('should grant access to all if no authProvider', async () => {
        const screen = render(
            <CoreAdminContext>
                <UseCanAccessRecordSources
                    action="read"
                    resource="posts"
                    sources={['id', 'title', 'author']}
                >
                    {StateInpector}
                </UseCanAccessRecordSources>
            </CoreAdminContext>
        );

        expect(
            screen.getByText(JSON.stringify({ canAccess: {}, isPending: true }))
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    JSON.stringify({
                        canAccess: { id: true, title: true, author: true },
                        isPending: false,
                    })
                )
            );
        });
    });

    it('should grant access to all if no authProvider.canAccess', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        const screen = render(
            <CoreAdminContext authProvider={authProvider}>
                <UseCanAccessRecordSources
                    action="read"
                    resource="posts"
                    sources={['id', 'title', 'author']}
                >
                    {StateInpector}
                </UseCanAccessRecordSources>
            </CoreAdminContext>
        );

        expect(
            screen.getByText(JSON.stringify({ canAccess: {}, isPending: true }))
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    JSON.stringify({
                        canAccess: { id: true, title: true, author: true },
                        isPending: false,
                    })
                )
            );
        });
    });
});
