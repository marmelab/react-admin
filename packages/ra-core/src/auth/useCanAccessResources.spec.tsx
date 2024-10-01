import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { Basic } from './useCanAccessResources.stories';

describe('useCanAccessResources', () => {
    it('should call authProvider.canAccess for every resource', async () => {
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

        screen.getByText('LOADING');

        expect(canAccess).toBeCalledTimes(3);
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.id',
            signal: undefined,
        });
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.title',
            signal: undefined,
        });
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.author',
            signal: undefined,
        });

        await screen.findByText(
            JSON.stringify({
                'posts.id': true,
                'posts.title': true,
                'posts.author': true,
            })
        );

        expect(screen.queryByText('LOADING')).toBeNull();
    });

    it('should grant access to each resource based on canAccess result', async () => {
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

        screen.getByText('LOADING');

        await screen.findByText(
            JSON.stringify({
                'posts.id': false,
                'posts.title': true,
                'posts.author': true,
            })
        );
        expect(screen.queryByText('LOADING')).toBeNull();
    });

    it('should grant access to all resources if no authProvider', async () => {
        render(<Basic authProvider={null} />);
        expect(screen.queryByText('LOADING')).toBeNull();

        screen.getByText(
            JSON.stringify({
                'posts.id': true,
                'posts.title': true,
                'posts.author': true,
            })
        );
    });

    it('should grant access to all resources if no authProvider.canAccess', async () => {
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        render(<Basic authProvider={authProvider} />);
        expect(screen.queryByText('LOADING')).toBeNull();

        screen.getByText(
            JSON.stringify({
                'posts.id': true,
                'posts.title': true,
                'posts.author': true,
            })
        );
    });
});
