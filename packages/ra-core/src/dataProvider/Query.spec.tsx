import * as React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import expect from 'expect';

import Query from './Query';
import { CoreAdmin, Resource } from '../core';
import { renderWithRedux, TestContext } from 'ra-test';
import DataProviderContext from './DataProviderContext';
import { showNotification, refreshView, setListSelectedIds } from '../actions';
import { useNotify, useRefresh } from '../sideEffect';
import { History } from 'history';

describe('Query', () => {
    it('should render its child', () => {
        const { getByTestId } = renderWithRedux(
            <Query type="getList" resource="bar">
                {() => <div data-testid="test">Hello</div>}
            </Query>
        );
        expect(getByTestId('test').textContent).toBe('Hello');
    });

    it('should dispatch a fetch action when mounting', () => {
        let dispatchSpy;
        const myPayload = {};
        act(() => {
            const result = renderWithRedux(
                <Query type="getList" resource="myresource" payload={myPayload}>
                    {() => <div>Hello</div>}
                </Query>
            );

            dispatchSpy = result.dispatch;
        });

        const action = dispatchSpy.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should set the loading state to loading when mounting', () => {
        const myPayload = {};
        const { getByText } = renderWithRedux(
            <Query type="getList" resource="myresource" payload={myPayload}>
                {({ loading }) => (
                    <div className={loading ? 'loading' : 'idle'}>Hello</div>
                )}
            </Query>
        );
        expect(getByText('Hello').className).toEqual('loading');
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
        let getByTestId;
        act(() => {
            const res = render(
                <CoreAdmin dataProvider={dataProvider}>
                    <Resource name="foo" list={Foo} />
                </CoreAdmin>
            );
            getByTestId = res.getByTestId;
        });
        const testElement = getByTestId('test');
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
        let getByTestId;
        act(() => {
            const res = render(
                <CoreAdmin dataProvider={dataProvider}>
                    <Resource name="foo" list={Foo} />
                </CoreAdmin>
            );
            getByTestId = res.getByTestId;
        });
        const testElement = getByTestId('test');
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
        let getByTestId;
        act(() => {
            const res = render(
                <CoreAdmin dataProvider={dataProvider}>
                    <Resource name="foo" list={Foo} />
                </CoreAdmin>
            );
            getByTestId = res.getByTestId;
        });
        const testElement = getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        expect(testElement.className).toEqual('loading');

        await waitFor(() => {
            expect(testElement.textContent).toEqual('provider error');
            expect(testElement.className).toEqual('idle');
        });
    });

    it('should dispatch a new fetch action when updating', () => {
        let dispatchSpy;
        const myPayload = {};
        const { rerender } = render(
            <TestContext>
                {({ store }) => {
                    dispatchSpy = jest.spyOn(store, 'dispatch');
                    return (
                        <Query
                            type="getList"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    );
                }}
            </TestContext>
        );
        expect(dispatchSpy.mock.calls.length).toEqual(3);
        const mySecondPayload = { foo: 1 };
        act(() => {
            rerender(
                <TestContext>
                    {() => (
                        <Query
                            type="getList"
                            resource="myresource"
                            payload={mySecondPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    )}
                </TestContext>
            );
        });
        expect(dispatchSpy.mock.calls.length).toEqual(6);
        const action = dispatchSpy.mock.calls[3][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(mySecondPayload);
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should not dispatch a new fetch action when updating with the same query props', () => {
        let dispatchSpy;
        const { rerender } = render(
            <TestContext>
                {({ store }) => {
                    dispatchSpy = jest.spyOn(store, 'dispatch');
                    const myPayload = {
                        foo: {
                            bar: 1,
                        },
                    };
                    return (
                        <Query
                            type="getList"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    );
                }}
            </TestContext>
        );
        expect(dispatchSpy.mock.calls.length).toEqual(3);
        act(() => {
            const myPayload = {
                foo: {
                    bar: 1,
                },
            };
            rerender(
                <TestContext>
                    {() => (
                        <Query
                            type="getList"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    )}
                </TestContext>
            );
        });
        expect(dispatchSpy.mock.calls.length).toEqual(3);
    });

    it('supports declarative onSuccess side effects', async () => {
        let dispatchSpy;
        let historyForAssertions: History;

        const dataProvider = {
            getList: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, foo: 'bar' }], total: 42 })
            ),
        };

        act(() => {
            render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store, history }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            historyForAssertions = history;
                            return (
                                <Query
                                    type="getList"
                                    resource="foo"
                                    options={{
                                        onSuccess: {
                                            notification: {
                                                body: 'Youhou!',
                                                level: 'info',
                                            },
                                            redirectTo: '/a_path',
                                            refresh: true,
                                            unselectAll: true,
                                        },
                                    }}
                                >
                                    {({ loading, data, total }) => (
                                        <div
                                            data-testid="test"
                                            className={
                                                loading ? 'loading' : 'idle'
                                            }
                                        >
                                            {loading ? 'no data' : total}
                                        </div>
                                    )}
                                </Query>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
        });

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Youhou!', 'info')
            );
            expect(historyForAssertions.location.pathname).toEqual('/a_path');
            expect(dispatchSpy).toHaveBeenCalledWith(refreshView());
            expect(dispatchSpy).toHaveBeenCalledWith(
                setListSelectedIds('foo', [])
            );
        });
    });

    it('supports onSuccess function for side effects', async () => {
        let dispatchSpy;
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
                            notify('Youhou!');
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
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return <Foo />;
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
        });

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Youhou!', 'info')
            );
        });
    });

    it('supports declarative onFailure side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let dispatchSpy;
        let historyForAssertions: History;

        const dataProvider = {
            getList: jest.fn(() =>
                Promise.reject({ message: 'provider error' })
            ),
        };

        act(() => {
            render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store, history }) => {
                            historyForAssertions = history;
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return (
                                <Query
                                    type="getList"
                                    resource="foo"
                                    options={{
                                        onFailure: {
                                            notification: {
                                                body: 'Damn!',
                                                level: 'warning',
                                            },
                                            redirectTo: '/a_path',
                                            refresh: true,
                                            unselectAll: true,
                                        },
                                    }}
                                >
                                    {({ loading, data, total }) => (
                                        <div
                                            data-testid="test"
                                            className={
                                                loading ? 'loading' : 'idle'
                                            }
                                        >
                                            {loading ? 'no data' : total}
                                        </div>
                                    )}
                                </Query>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
        });

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Damn!', 'warning')
            );
            expect(historyForAssertions.location.pathname).toEqual('/a_path');
            expect(dispatchSpy).toHaveBeenCalledWith(refreshView());
            expect(dispatchSpy).toHaveBeenCalledWith(
                setListSelectedIds('foo', [])
            );
        });
    });

    it('supports onFailure function for side effects', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let dispatchSpy;
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
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return <Foo />;
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
        });

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Damn!', 'warning')
            );
        });
    });

    it('should fetch again when refreshing', async () => {
        let dispatchSpy;

        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const Button = () => {
            const refresh = useRefresh();
            return (
                <button data-testid="test" onClick={refresh}>
                    Click me
                </button>
            );
        };

        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext enableReducers>
                        {({ store, history }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return (
                                <Query type="mytype" resource="foo">
                                    {() => <Button />}
                                </Query>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith({
                type: 'CUSTOM_FETCH',
                payload: undefined,
                meta: { resource: 'foo' },
            });
        });
        dispatchSpy.mockClear(); // clear initial fetch

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith({
                type: 'CUSTOM_FETCH',
                payload: undefined,
                meta: { resource: 'foo' },
            });
        });
    });

    it('should allow custom dataProvider methods without resource', () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const myPayload = {};
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Query type="mytype" payload={myPayload}>
                    {() => <div />}
                </Query>
            </DataProviderContext.Provider>
        );
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.meta.resource).toBeUndefined();
        expect(dataProvider.mytype).toHaveBeenCalledWith(myPayload);
    });
});
