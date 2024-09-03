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
        expect(screen.getByText('isAccessible: YES')).toBeDefined();

        fireEvent.click(screen.getByText('Can I write posts'));

        await waitFor(() => {
            expect(canAccess).toBeCalledWith({
                resource: 'posts',
                action: 'write',
            });
        });
        expect(screen.getByText('isAccessible: NO')).toBeDefined();

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
        expect(screen.getByText('isAccessible: YES')).toBeDefined();
        expect(canAccess).toBeCalledTimes(3);
    });

    it('should call authProvider.canAccess once for each params', async () => {
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
        expect(screen.getByText('isAccessible: YES')).toBeDefined();
        expect(canAccess).toBeCalledTimes(1);
        fireEvent.click(screen.getByText('Can I read posts'));
        await new Promise(resolve => setTimeout(resolve, 0)); // need to wait for the click to take effect
        expect(canAccess).toBeCalledTimes(1);
    });

    it('should return error thrown by canAccess in a error key', async () => {
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
        expect(screen.queryByText('isAccessible: YES')).toBeNull();
        expect(screen.getByText('uh oh, something went wrong')).toBeDefined();
    });

    it('should retry call when previous try returned an error', async () => {
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
        expect(screen.getByText('uh oh, something went wrong')).toBeDefined();
        fireEvent.click(screen.getByText('Can I read posts'));
        await new Promise(resolve => setTimeout(resolve, 0)); // need to wait for the click to take effect
        expect(canAccess).toBeCalledTimes(2);
    });

    it('should return a function always allowing access when no authProvider', async () => {
        render(<Basic authProvider={null} />);

        fireEvent.click(screen.getByText('Can I read posts'));
        await waitFor(() => {
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });

        fireEvent.click(screen.getByText('Can I write posts'));
        await waitFor(() => {
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });

        fireEvent.click(screen.getByText('Can I read comments'));
        await waitFor(() => {
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });
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
        await waitFor(() => {
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });

        fireEvent.click(screen.getByText('Can I write posts'));
        await waitFor(() => {
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });

        fireEvent.click(screen.getByText('Can I read comments'));
        await waitFor(() => {
            expect(screen.queryByText('isAccessible: YES')).not.toBeNull();
        });
    });
});
