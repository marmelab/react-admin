import * as React from 'react';
import expect from 'expect';
import { waitFor, render, fireEvent, screen } from '@testing-library/react';
import { Basic } from './useCanAccessCallback.stories';

describe('useCanAccessCallback', () => {
    it('should return a function allowing to call authProvider.canAccess', async () => {
        const canAccess = jest
            .fn()
            .mockImplementation(async ({ action }) => action === 'read');
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess,
        };
        render(<Basic authProvider={authProvider} />);

        fireEvent.click(screen.getByText('Can I read posts'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'posts',
                action: 'read',
            });
        });
        await screen.findByText('canAccess: YES');

        fireEvent.click(screen.getByText('Can I write posts'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'posts',
                action: 'write',
            });
        });
        await screen.findByText('canAccess: NO');

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
        await screen.findByText('canAccess: YES');
        expect(canAccess).toBeCalledTimes(3);
    });

    it('should reject when an error is thrown by canAccess', async () => {
        const canAccess = jest
            .fn()
            .mockRejectedValue(new Error('uh oh, something went wrong'));
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess,
        };
        render(<Basic authProvider={authProvider} />);

        fireEvent.click(screen.getByText('Can I read posts'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'posts',
                action: 'read',
            });
        });
        await screen.findByText('uh oh, something went wrong');
        expect(screen.queryByText('canAccess: YES')).toBeNull();
    });

    it('should return a function always allowing access when no authProvider', async () => {
        render(<Basic authProvider={null} />);

        fireEvent.click(screen.getByText('Can I read posts'));
        await screen.findByText('canAccess: YES');

        fireEvent.click(screen.getByText('Can I write posts'));
        await screen.findByText('canAccess: YES');

        fireEvent.click(screen.getByText('Can I read comments'));
        await screen.findByText('canAccess: YES');
    });

    it('should return a function always allowing access when authProvider has no canAccess method', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        render(<Basic authProvider={authProvider} />);

        fireEvent.click(screen.getByText('Can I read posts'));
        await screen.findByText('canAccess: YES');

        fireEvent.click(screen.getByText('Can I write posts'));
        await screen.findByText('canAccess: YES');

        fireEvent.click(screen.getByText('Can I read comments'));
        await screen.findByText('canAccess: YES');
    });
});
