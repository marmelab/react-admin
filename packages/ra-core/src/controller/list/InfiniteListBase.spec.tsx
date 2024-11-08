import * as React from 'react';
import {
    AccessControl,
    Basic,
    NoAuthProvider,
    WithAuthProviderNoAccessControl,
} from './InfiniteListBase.stories';
import { render, screen, waitFor } from '@testing-library/react';
import { testDataProvider } from '../../dataProvider';

describe('InfiniteListBase', () => {
    it('should fetch a list of records on mount, put it in a ListContext, and render its children', async () => {
        render(<Basic />);
        expect(screen.queryByText('Loading...')).not.toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });
        await screen.findByText('War and Peace');
    });
    it('should create an InfinitePaginationContext allowing to fetch following pages', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });
        // first page is visible
        await screen.findByText('The Lord of the Rings'); // #5
        // next page is not visible
        expect(screen.queryByText('And Then There Were None')).toBeNull(); // #6
        screen.getByText('Next').click();
        // next page is now visible
        await screen.findByText('And Then There Were None'); // #6
        // first page is still visible
        await screen.findByText('The Lord of the Rings'); // #5
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
});
