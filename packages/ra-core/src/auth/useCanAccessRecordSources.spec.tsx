import * as React from 'react';
import expect from 'expect';
import { waitFor, render, screen } from '@testing-library/react';
import { Basic } from './useCanAccessRecordSources.stories';

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
        render(<Basic authProvider={authProvider} />);

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
        render(<Basic authProvider={authProvider} />);

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
        render(<Basic authProvider={null} />);

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
        render(<Basic authProvider={authProvider} />);

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
