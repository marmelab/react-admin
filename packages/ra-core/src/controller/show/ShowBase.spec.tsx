import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { testDataProvider } from '../../dataProvider';
import {
    AccessControl,
    DefaultTitle,
    NoAuthProvider,
    WithAuthProviderNoAccessControl,
    WithRenderProp,
} from './ShowBase.stories';

describe('ShowBase', () => {
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
});
