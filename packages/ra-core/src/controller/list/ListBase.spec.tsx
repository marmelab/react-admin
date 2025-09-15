import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    AccessControl,
    DefaultTitle,
    Empty,
    EmptyWhileLoading,
    EmptyWhileLoadingRender,
    FetchError,
    Loading,
    NoAuthProvider,
    Offline,
    WithAuthProviderNoAccessControl,
    WithRenderProps,
} from './ListBase.stories';
import { testDataProvider } from '../../dataProvider';
import { onlineManager } from '@tanstack/react-query';

describe('ListBase', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should load data immediately if authProvider is not provided', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'Hello' }], total: 1 })
            ),
        });
        render(<NoAuthProvider dataProvider={dataProvider} />);
        expect(dataProvider.getList).toHaveBeenCalled();
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
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'Hello' }], total: 1 })
            ),
        });
        render(
            <WithAuthProviderNoAccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
                ListProps={{ disableAuthentication: true }}
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
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'Hello' }], total: 1 })
            ),
        });
        render(
            <WithAuthProviderNoAccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
            />
        );
        expect(dataProvider.getList).not.toHaveBeenCalled();
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
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'Hello' }], total: 1 })
            ),
        });
        render(
            <AccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
            />
        );
        expect(dataProvider.getList).not.toHaveBeenCalled();
        await screen.findByText('Authentication loading...');
        resolveAuth!();
        expect(dataProvider.getList).not.toHaveBeenCalled();
        await screen.findByText('Authentication loading...');
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalled();
        });
        resolveCanAccess!(true);
        await screen.findByText('Hello');
    });

    it('should provide a default title', async () => {
        render(<DefaultTitle translations="default" />);
        await screen.findByText('Books (en)');
        fireEvent.click(screen.getByText('FR'));
        await screen.findByText('Livres (fr)');
    });

    it('should allow resource specific default title', async () => {
        render(<DefaultTitle translations="resource specific" />);
        await screen.findByText('Book list (en)');
        fireEvent.click(screen.getByText('FR'));
        await screen.findByText('Liste des livres (fr)');
    });

    it('should allow to use render props', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'Hello' }], total: 1 })
            ),
        });
        render(<WithRenderProps dataProvider={dataProvider} />);
        expect(dataProvider.getList).toHaveBeenCalled();
        await screen.findByText('Hello');
    });

    it('should render the offline prop node when offline', async () => {
        const { rerender } = render(<Offline isOnline={false} />);
        await screen.findByText('You are offline, cannot load data');
        rerender(<Offline isOnline />);
        await screen.findByText('War and Peace');
        expect(
            screen.queryByText('You are offline, cannot load data')
        ).toBeNull();
        rerender(<Offline isOnline={false} />);
        await screen.findByText('You are offline, the data may be outdated');
        fireEvent.click(screen.getByText('next'));
        await screen.findByText('You are offline, cannot load data');
        rerender(<Offline isOnline />);
        await screen.findByText('And Then There Were None');
        rerender(<Offline isOnline={false} />);
        fireEvent.click(screen.getByText('previous'));
        await screen.findByText('War and Peace');
        await screen.findByText('You are offline, the data may be outdated');
    });
    it('should render a custom empty component when data is empty', async () => {
        render(<Empty />);
        expect(screen.queryByText('Loading...')).not.toBeNull();
        expect(screen.queryByText('War and Peace')).toBeNull();
        fireEvent.click(screen.getByText('Resolve books loading'));
        await screen.findByText('No books');
    });
    it('should render nothing while loading if emptyWhileLoading is set to true', async () => {
        render(<EmptyWhileLoading />);
        expect(screen.queryByText('Loading...')).toBeNull();
        expect(screen.queryByText('War and Peace')).toBeNull();
        fireEvent.click(screen.getByText('Resolve books loading'));
        await screen.findByText('War and Peace');
    });
    it('should render nothing while loading if emptyWhileLoading is set to true and using the render prop', async () => {
        render(<EmptyWhileLoadingRender />);
        expect(screen.queryByText('Loading...')).toBeNull();
        expect(screen.queryByText('War and Peace')).toBeNull();
        fireEvent.click(screen.getByText('Resolve books loading'));
        await screen.findByText('War and Peace');
    });
    it('should render loading component while loading', async () => {
        render(<Loading />);
        expect(screen.queryByText('Loading books...')).not.toBeNull();
        expect(screen.queryByText('War and Peace')).toBeNull();
        fireEvent.click(screen.getByText('Resolve books loading'));
        await waitFor(() => {
            expect(screen.queryByText('Loading books...')).toBeNull();
        });
        await screen.findByText('War and Peace');
    });
    it('should render error component on error', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<FetchError />);
        expect(screen.queryByText('Cannot load books.')).toBeNull();
        expect(screen.queryByText('War and Peace')).toBeNull();
        fireEvent.click(screen.getByText('Reject books loading'));
        await waitFor(() => {
            expect(screen.queryByText('Cannot load books.')).not.toBeNull();
        });
        expect(screen.queryByText('War and Peace')).toBeNull();

        jest.spyOn(console, 'error').mockRestore();
    });
});
