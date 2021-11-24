import * as React from 'react';
import { FC } from 'react';
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import expect from 'expect';
import { Provider } from 'react-redux';

import Query from './Query';
import { createAdminStore, CoreAdminContext, Resource } from '../core';
import { showNotification } from '../actions';
import { useNotify, useRefresh } from '../sideEffect';

describe('Query', () => {
    it('should render its child', () => {
        render(
            <CoreAdminContext
                dataProvider={() => Promise.resolve({ data: [], total: 0 })}
            >
                <Query type="getList" resource="bar">
                    {() => <div data-testid="test">Hello</div>}
                </Query>
            </CoreAdminContext>
        );
        expect(screen.getByTestId('test').textContent).toBe('Hello');
    });

    it('should dispatch a fetch action when mounting', () => {
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');
        const myPayload = {};

        render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={() => Promise.resolve({ data: [], total: 0 })}
                >
                    <Query
                        type="getList"
                        resource="myresource"
                        payload={myPayload}
                    >
                        {() => <div>Hello</div>}
                    </Query>
                </CoreAdminContext>
            </Provider>
        );

        const action = dispatch.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should set the loading state to loading when mounting', () => {
        const myPayload = {};
        render(
            <CoreAdminContext
                dataProvider={() => Promise.resolve({ data: [], total: 0 })}
            >
                <Query type="getList" resource="myresource" payload={myPayload}>
                    {({ loading }) => (
                        <div className={loading ? 'loading' : 'idle'}>
                            Hello
                        </div>
                    )}
                </Query>
            </CoreAdminContext>
        );
        expect(screen.getByText('Hello').className).toEqual('loading');
    });

    it('should update the data state after a success response', async () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };
        const Foo = () => (
            <Query type="mytype" resource="foo">
                {({ loading, data }) => (
                    <div
                        data-testid="test"
                        className={loading ? 'loading' : 'idle'}
                    >
                        {data ? data.foo : 'no data'}
                    </div>
                )}
            </Query>
        );
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdminContext>
        );
        const testElement = screen.getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        expect(testElement.className).toEqual('loading');

        await waitFor(() => {
            expect(testElement.textContent).toEqual('bar');
            expect(testElement.className).toEqual('idle');
        });
    });

    it('should return the total prop if available', async () => {
        const dataProvider = {
            mytype: jest.fn(() =>
                Promise.resolve({ data: { foo: 'bar' }, total: 42 })
            ),
        };

        const Foo = () => (
            <Query type="mytype" resource="foo">
                {({ loading, data, total }) => (
                    <div
                        data-testid="test"
                        className={loading ? 'loading' : 'idle'}
                    >
                        {loading ? 'no data' : total}
                    </div>
                )}
            </Query>
        );
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdminContext>
        );
        const testElement = screen.getByTestId('test');
        expect(testElement.className).toEqual('loading');
        expect(testElement.textContent).toBe('no data');

        await waitFor(() => {
            expect(testElement.className).toEqual('idle');
            expect(testElement.textContent).toEqual('42');
        });
    });

    it('should update the error state after an error response', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.reject({ message: 'provider error' })
            ),
        };
        const Foo = () => (
            <Query type="getList" resource="foo">
                {({ loading, error }) => (
                    <div
                        data-testid="test"
                        className={loading ? 'loading' : 'idle'}
                    >
                        {error ? error.message : 'no data'}
                    </div>
                )}
            </Query>
        );
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdminContext>
        );

        const testElement = screen.getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        expect(testElement.className).toEqual('loading');

        await waitFor(() => {
            expect(testElement.textContent).toEqual('provider error');
            expect(testElement.className).toEqual('idle');
        });
    });

    it('should dispatch a new fetch action when updating', () => {
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');
        const myPayload = {};
        const { rerender } = render(
            <Provider store={store}>
                <CoreAdminContext
                    dataProvider={() => Promise.resolve({ data: [], total: 0 })}
                >
                    <Query
                        type="getList"
                        resource="myresource"
                        payload={myPayload}
                    >
                        {() => <div>Hello</div>}
                    </Query>
                </CoreAdminContext>
            </Provider>
        );
        expect(dispatch.mock.calls.length).toEqual(3);
        const mySecondPayload = { foo: 1 };
        act(() => {
            rerender(
                <Provider store={store}>
                    <CoreAdminContext
                        dataProvider={() =>
                            Promise.resolve({ data: [], total: 0 })
                        }
                    >
                        <Query
                            type="getList"
                            resource="myresource"
                            payload={mySecondPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    </CoreAdminContext>
                </Provider>
            );
        });
        expect(dispatch.mock.calls.length).toEqual(6);
        const action = dispatch.mock.calls[3][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(mySecondPayload);
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should not dispatch a new fetch action when updating with the same query props', () => {
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = {
            getList: () => Promise.resolve({ data: [], total: 0 }),
        };
        const Wrapper: FC = ({ children }) => (
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    {children}
                </CoreAdminContext>
            </Provider>
        );
        const { rerender } = render(
            <Query
                type="getList"
                resource="myresource"
                payload={{
                    foo: {
                        bar: 1,
                    },
                }}
            >
                {() => <div>Hello</div>}
            </Query>,
            { wrapper: Wrapper }
        );
        expect(dispatch.mock.calls.length).toEqual(3);
        rerender(
            <Query
                type="getList"
                resource="myresource"
                payload={{
                    foo: {
                        bar: 1,
                    },
                }}
            >
                {() => <div>Hello</div>}
            </Query>
        );
        expect(dispatch.mock.calls.length).toEqual(3);
    });

    it('supports onSuccess function for side effects', async () => {
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, foo: 'bar' }], total: 42 })
            ),
        };

        const Foo = () => {
            const notify = useNotify();
            return (
                <Query
                    type="getList"
                    resource="foo"
                    options={{
                        onSuccess: () => {
                            notify('Youhou!', { type: 'info' });
                        },
                    }}
                >
                    {({ loading, data, total }) => (
                        <div
                            data-testid="test"
                            className={loading ? 'loading' : 'idle'}
                        >
                            {loading ? 'no data' : total}
                        </div>
                    )}
                </Query>
            );
        };

        act(() => {
            render(
                <Provider store={store}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <Foo />
                    </CoreAdminContext>
                </Provider>
            );
        });

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith(
                showNotification('Youhou!', 'info')
            );
        });

        dispatch.mockRestore();
    });

    it('supports onFailure function for side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = {
            getList: jest.fn(() =>
                Promise.reject({ message: 'provider error' })
            ),
        };

        const Foo = () => {
            const notify = useNotify();
            return (
                <Query
                    type="getList"
                    resource="foo"
                    options={{
                        onFailure: () => {
                            notify('Damn!', { type: 'warning' });
                        },
                    }}
                >
                    {({ loading, data, total }) => (
                        <div
                            data-testid="test"
                            className={loading ? 'loading' : 'idle'}
                        >
                            {loading ? 'no data' : total}
                        </div>
                    )}
                </Query>
            );
        };
        act(() => {
            render(
                <Provider store={store}>
                    <CoreAdminContext dataProvider={dataProvider}>
                        <Foo />
                    </CoreAdminContext>
                </Provider>
            );
        });

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith(
                showNotification('Damn!', 'warning')
            );
        });

        dispatch.mockRestore();
    });

    it('should fetch again when refreshing', async () => {
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');

        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const Button = () => {
            const refresh = useRefresh();
            return (
                <button data-testid="test" onClick={() => refresh()}>
                    Click me
                </button>
            );
        };

        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Query type="mytype" resource="foo">
                        {() => <Button />}
                    </Query>
                </CoreAdminContext>
            </Provider>
        );

        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: 'CUSTOM_FETCH',
                payload: undefined,
                meta: { resource: 'foo' },
            });
        });
        dispatch.mockClear(); // clear initial fetch

        const testElement = screen.getByTestId('test');
        fireEvent.click(testElement);
        await waitFor(() => {
            expect(dispatch).toHaveBeenCalledWith({
                type: 'CUSTOM_FETCH',
                payload: undefined,
                meta: { resource: 'foo' },
            });
        });
    });

    it('should allow custom dataProvider methods without resource', () => {
        const store = createAdminStore({});
        let dispatch = jest.spyOn(store, 'dispatch');
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const myPayload = {};
        render(
            <Provider store={store}>
                <CoreAdminContext dataProvider={dataProvider}>
                    <Query type="mytype" payload={myPayload}>
                        {() => <div />}
                    </Query>
                </CoreAdminContext>
            </Provider>
        );
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.meta.resource).toBeUndefined();
        expect(dataProvider.mytype).toHaveBeenCalledWith(myPayload);
    });
});
