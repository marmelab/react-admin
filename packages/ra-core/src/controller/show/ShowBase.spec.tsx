import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { testDataProvider } from '../../dataProvider';
import {
    AccessControl,
    DefaultTitle,
    NoAuthProvider,
    Offline,
    WithAuthProviderNoAccessControl,
    WithRenderProp,
    Loading,
    FetchError,
    RedirectOnError,
} from './ShowBase.stories';
import { onlineManager } from '@tanstack/react-query';

describe('ShowBase', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should load data immediately if authProvider is not provided', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: jest.fn(() =>
                Promise.resolve({ data: { id: 12, test: 'Hello' } })
            ),
        });
        render(<NoAuthProvider dataProvider={dataProvider} />);
        expect(dataProvider.getOne).toHaveBeenCalled();
        await screen.findByText('Hello');
    });
    it('should not wait for the authentication resolution before loading data when disableAuthentication is true', async () => {
        const authProvider = {
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            checkAuth: jest.fn(),
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: jest.fn(() =>
                Promise.resolve({ data: { id: 12, test: 'Hello' } })
            ),
        });
        render(
            <WithAuthProviderNoAccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
                ShowProps={{ disableAuthentication: true }}
            />
        );
        await screen.findByText('Hello');
        expect(authProvider.checkAuth).not.toHaveBeenCalled();
    });
    it('should wait for the authentication resolution before loading data', async () => {
        let resolveAuth: () => void;
        const authProvider = {
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            checkAuth: () =>
                new Promise<void>(resolve => {
                    resolveAuth = resolve;
                }),
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: jest.fn(() =>
                Promise.resolve({ data: { id: 12, test: 'Hello' } })
            ),
        });
        render(
            <WithAuthProviderNoAccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
            />
        );
        expect(dataProvider.getOne).not.toHaveBeenCalled();
        await screen.findByText('Authentication loading...');
        resolveAuth!();
        await screen.findByText('Hello');
    });
    it('should wait for both the authentication and authorization resolution before loading data', async () => {
        let resolveAuth: () => void;
        let resolveCanAccess: (value: boolean) => void;
        const authProvider = {
            login: () => Promise.resolve(),
            logout: () => Promise.resolve(),
            checkError: () => Promise.resolve(),
            checkAuth: () =>
                new Promise<void>(resolve => {
                    resolveAuth = resolve;
                }),
            canAccess: jest.fn(
                () =>
                    new Promise<boolean>(resolve => {
                        resolveCanAccess = resolve;
                    })
            ),
        };
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: jest.fn(() =>
                Promise.resolve({ data: { id: 12, test: 'Hello' } })
            ),
        });
        render(
            <AccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
            />
        );
        expect(dataProvider.getOne).not.toHaveBeenCalled();
        await screen.findByText('Authentication loading...');
        resolveAuth!();
        expect(dataProvider.getOne).not.toHaveBeenCalled();
        await screen.findByText('Authentication loading...');
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalled();
        });
        resolveCanAccess!(true);
        await screen.findByText('Hello');
    });

    it('should provide a default title', async () => {
        render(<DefaultTitle translations="default" />);
        await screen.findByText('Post Hello (en)');
        fireEvent.click(screen.getByText('FR'));
        await screen.findByText('Article Hello (fr)');
    });

    it('should allow resource specific default title', async () => {
        render(<DefaultTitle translations="resource specific" />);
        await screen.findByText('Details of article Hello (en)');
        fireEvent.click(screen.getByText('FR'));
        await screen.findByText("Détails de l'article Hello (fr)");
    });

    it('should support render prop', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: jest.fn(() =>
                Promise.resolve({ data: { id: 12, test: 'Hello' } })
            ),
        });
        render(<WithRenderProp dataProvider={dataProvider} />);
        expect(dataProvider.getOne).toHaveBeenCalled();
        await screen.findByText('Hello');
    });

    it('should render the offline prop node when offline', async () => {
        const { rerender } = render(<Offline isOnline={false} />);
        await screen.findByText('You are offline, cannot load data');
        rerender(<Offline isOnline={true} />);
        await screen.findByText('Hello');
        expect(
            screen.queryByText('You are offline, cannot load data')
        ).toBeNull();
        rerender(<Offline isOnline={false} />);
        await screen.findByText('You are offline, the data may be outdated');
        // Ensure the data is still displayed when going offline after it was loaded
        await screen.findByText('You are offline, the data may be outdated');
        await screen.findByText('Hello');
    });
    it('should render loading component while loading', async () => {
        render(<Loading />);
        expect(screen.queryByText('Loading data...')).not.toBeNull();
        expect(screen.queryByText('Hello')).toBeNull();
        fireEvent.click(screen.getByText('Resolve loading'));
        await waitFor(() => {
            expect(screen.queryByText('Loading data...')).toBeNull();
        });
        await screen.findByText('Hello');
    });
    it('should render error component on error', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<FetchError />);
        expect(screen.queryByText('Something went wrong.')).toBeNull();
        expect(screen.queryByText('Hello')).toBeNull();
        fireEvent.click(screen.getByText('Reject loading'));
        await waitFor(() => {
            expect(screen.queryByText('Something went wrong.')).not.toBeNull();
        });
        expect(screen.queryByText('Hello')).toBeNull();

        jest.spyOn(console, 'error').mockRestore();
    });
    it('should redirect when no error component is provided', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<RedirectOnError />);
        expect(screen.queryByText('Hello')).toBeNull();
        fireEvent.click(screen.getByText('Reject loading'));
        await waitFor(() => {
            expect(screen.queryByText('List view')).not.toBeNull();
        });
        expect(screen.queryByText('Hello')).toBeNull();

        jest.spyOn(console, 'error').mockRestore();
    });
});
