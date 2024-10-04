import * as React from 'react';
import expect from 'expect';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';

import { testDataProvider } from '../../dataProvider';
import {
    AccessControl,
    NoAuthProvider,
    WithAuthProviderNoAccessControl,
} from './CreateBase.stories';

describe('CreateBase', () => {
    it('should give access to the save function', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });

        render(<NoAuthProvider dataProvider={dataProvider} />);
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('posts', {
                data: { test: 'test' },
            });
        });
    });

    it('should allow to override the onSuccess function', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });
        const onSuccess = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationOptions={{ onSuccess }}
            />
        );

        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                {
                    id: 1,
                    test: 'test',
                },
                { data: { test: 'test' }, resource: 'posts' },
                undefined
            );
        });
    });

    it('should allow to override the onSuccess function at call time', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });
        const onSuccess = jest.fn();
        const onSuccessOverride = jest.fn();

        const { getByText } = render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationOptions={{ onSuccess }}
                callTimeOptions={{ onSuccess: onSuccessOverride }}
            />
        );

        getByText('save').click();

        await waitFor(() => {
            expect(onSuccessOverride).toHaveBeenCalledWith(
                {
                    id: 1,
                    test: 'test',
                },
                { data: { test: 'test' }, resource: 'posts' },
                undefined
            );
        });
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should allow to override the onError function', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn(() => Promise.reject({ message: 'test' })),
        });
        const onError = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationOptions={{ onError }}
            />
        );

        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
                { message: 'test' },
                { data: { test: 'test' }, resource: 'posts' },
                undefined
            );
        });
    });

    it('should allow to override the onError function at call time', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn(() => Promise.reject({ message: 'test' })),
        });
        const onError = jest.fn();
        const onErrorOverride = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationOptions={{ onError }}
                callTimeOptions={{ onError: onErrorOverride }}
            />
        );

        screen.getByText('save').click();

        await waitFor(() => {
            expect(onErrorOverride).toHaveBeenCalledWith(
                { message: 'test' },
                { data: { test: 'test' }, resource: 'posts' },
                undefined
            );
        });
        expect(onError).not.toHaveBeenCalled();
    });

    it('should allow to override the transform function', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });
        const transform = jest
            .fn()
            .mockReturnValueOnce({ test: 'test transformed' });

        render(
            <NoAuthProvider dataProvider={dataProvider} transform={transform} />
        );

        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(transform).toHaveBeenCalledWith({ test: 'test' });
        });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('posts', {
                data: { test: 'test transformed' },
            });
        });
    });

    it('should allow to override the transform function at call time', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });
        const transform = jest.fn();
        const transformOverride = jest
            .fn()
            .mockReturnValueOnce({ test: 'test transformed' });

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                transform={transform}
                callTimeOptions={{
                    transform: transformOverride,
                }}
            />
        );

        screen.getByText('save').click();

        await waitFor(() => {
            expect(transformOverride).toHaveBeenCalledWith({ test: 'test' });
        });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('posts', {
                data: { test: 'test transformed' },
            });
        });
        expect(transform).not.toHaveBeenCalled();
    });

    it('should show the view immediately if authProvider is not provided', () => {
        const dataProvider = testDataProvider();
        render(<NoAuthProvider dataProvider={dataProvider} />);
        screen.getByText('save');
    });
    it('should wait for the authentication resolution before showing the view', async () => {
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
        const dataProvider = testDataProvider();
        render(
            <WithAuthProviderNoAccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
            />
        );
        await screen.findByText('Authentication loading...');
        resolveAuth!();
        await screen.findByText('save');
    });
    it('should wait for both the authentication and authorization resolution before showing the view', async () => {
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
        const dataProvider = testDataProvider();
        render(
            <AccessControl
                authProvider={authProvider}
                dataProvider={dataProvider}
            />
        );
        await screen.findByText('Authentication loading...');
        resolveAuth!();
        await screen.findByText('Authentication loading...');
        await waitFor(() => {
            expect(authProvider.canAccess).toHaveBeenCalled();
        });
        resolveCanAccess!(true);
        await screen.findByText('save');
    });
});
