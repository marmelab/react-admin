import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    AccessControl,
    DefaultTitle,
    NoAuthProvider,
    WithAuthProviderNoAccessControl,
    WithRenderProps,
} from './ListBase.stories';
import { testDataProvider } from '../../dataProvider';

describe('ListBase', () => {
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
});
