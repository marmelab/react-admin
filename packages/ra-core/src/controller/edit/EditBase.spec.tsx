import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { testDataProvider } from '../../dataProvider';
import {
    AccessControl,
    DefaultTitle,
    FetchError,
    Loading,
    NoAuthProvider,
    Offline,
    RedirectOnError,
    WithAuthProviderNoAccessControl,
    WithRenderProps,
} from './EditBase.stories';
import { onlineManager } from '@tanstack/react-query';

describe('EditBase', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should give access to the save function', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
            />
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { test: 'test' },
                previousData: { id: 12, test: 'previous' },
            });
        });
    });

    it('should allow to override the onSuccess function', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const onSuccess = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
                mutationOptions={{ onSuccess }}
            />
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                {
                    id: 12,
                    test: 'test',
                },
                {
                    id: 12,
                    data: { test: 'test' },
                    previousData: { id: 12, test: 'previous' },
                    resource: 'posts',
                    meta: undefined,
                },
                { snapshot: expect.any(Array) },
                expect.anything()
            );
        });
    });

    it('should allow to override the onSuccess function at call time', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const onSuccess = jest.fn();
        const onSuccessOverride = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
                mutationOptions={{ onSuccess }}
                callTimeOptions={{ onSuccess: onSuccessOverride }}
            />
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(onSuccessOverride).toHaveBeenCalledWith(
                {
                    id: 12,
                    test: 'test',
                },
                {
                    id: 12,
                    data: { test: 'test' },
                    previousData: { id: 12, test: 'previous' },
                    resource: 'posts',
                    meta: undefined,
                },
                { snapshot: expect.any(Array) },
                expect.anything()
            );
        });
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should allow to override the onError function', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn(() => Promise.reject({ message: 'test' })),
        });
        const onError = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
                mutationOptions={{ onError }}
            />
        );

        await screen.findByText('previous');
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
                { message: 'test' },
                {
                    id: 12,
                    data: { test: 'test' },
                    previousData: { id: 12, test: 'previous' },
                    resource: 'posts',
                    meta: undefined,
                },
                { snapshot: expect.any(Array) },
                expect.anything()
            );
        });
    });

    it('should allow to override the onError function at call time', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn(() => Promise.reject({ message: 'test' })),
        });
        const onError = jest.fn();
        const onErrorOverride = jest.fn();

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
                mutationOptions={{ onError }}
                callTimeOptions={{ onError: onErrorOverride }}
            />
        );

        await screen.findByText('previous');
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(onErrorOverride).toHaveBeenCalledWith(
                { message: 'test' },
                {
                    id: 12,
                    data: { test: 'test' },
                    previousData: { id: 12, test: 'previous' },
                    resource: 'posts',
                    meta: undefined,
                },
                { snapshot: expect.any(Array) },
                expect.anything()
            );
        });
        expect(onError).not.toHaveBeenCalled();
    });

    it('should allow to override the transform function', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const transform = jest.fn((data, _options) => ({
            ...data,
            test: 'test transformed',
        }));

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
                transform={transform}
            />
        );

        await screen.findByText('previous');
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(transform).toHaveBeenCalledWith(
                { test: 'test' },
                { previousData: { id: 12, test: 'previous' } }
            );
        });
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { test: 'test transformed' },
                previousData: { id: 12, test: 'previous' },
            });
        });
    });

    it('should allow to override the transform function at call time', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const transform = jest.fn();
        const transformOverride = jest.fn((data, _options) => ({
            ...data,
            test: 'test transformed',
        }));

        render(
            <NoAuthProvider
                dataProvider={dataProvider}
                mutationMode="pessimistic"
                transform={transform}
                callTimeOptions={{
                    transform: transformOverride,
                }}
            />
        );

        await screen.findByText('previous');
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(transformOverride).toHaveBeenCalledWith(
                { test: 'test' },
                { previousData: { id: 12, test: 'previous' } }
            );
        });
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { test: 'test transformed' },
                previousData: { id: 12, test: 'previous' },
            });
        });
        expect(transform).not.toHaveBeenCalled();
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
                EditProps={{ disableAuthentication: true }}
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
        await screen.findByText('Update article Hello (en)');
        fireEvent.click(screen.getByText('FR'));
        await screen.findByText("Modifier l'article Hello (fr)");
    });

    it('should allow renderProp', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'Hello' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        render(
            <WithRenderProps
                dataProvider={dataProvider}
                mutationMode="pessimistic"
            />
        );
        await screen.findByText('12');
        await screen.findByText('Hello');
        fireEvent.click(screen.getByText('save'));

        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: 12,
                data: { test: 'test' },
                previousData: { id: 12, test: 'Hello' },
            });
        });
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
