import * as React from 'react';
import { fireEvent, waitFor, act, render } from '@testing-library/react';
import expect from 'expect';

import Mutation from './Mutation';
import { showNotification, refreshView, setListSelectedIds } from '../actions';
import DataProviderContext from './DataProviderContext';
import { renderWithRedux, TestContext } from 'ra-test';
import { useNotify } from '../sideEffect';
import { History } from 'history';

describe('Mutation', () => {
    it('should render its child function', () => {
        const { getByTestId } = renderWithRedux(
            <Mutation type="foo" resource="bar">
                {() => <div data-testid="test">Hello</div>}
            </Mutation>
        );
        expect(getByTestId('test').textContent).toBe('Hello');
    });

    it('should pass useEditController return value to child', () => {
        let callback = null;
        let state = null;
        renderWithRedux(
            <Mutation type="foo" resource="bar">
                {(mutate, controllerState) => {
                    callback = mutate;
                    state = controllerState;
                    return <div data-testid="test">Hello</div>;
                }}
            </Mutation>
        );
        expect(callback).toBeInstanceOf(Function);
        expect(state).toEqual({
            data: null,
            error: null,
            total: null,
            loaded: false,
            loading: false,
        });
    });

    it('supports declarative onSuccess side effects', async () => {
        let dispatchSpy;
        let historyForAssertions: History;

        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store, history }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            historyForAssertions = history;
                            return (
                                <Mutation
                                    type="mytype"
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
                                    {(mutate, { data }) => (
                                        <button
                                            data-testid="test"
                                            onClick={mutate}
                                        >
                                            {data ? data.foo : 'no data'}
                                        </button>
                                    )}
                                </Mutation>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
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

    it('supports onSuccess side effects using hooks', async () => {
        let dispatchSpy;
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const Foo = () => {
            const notify = useNotify();
            return (
                <Mutation
                    type="mytype"
                    resource="foo"
                    options={{
                        onSuccess: () => {
                            notify('Youhou!');
                        },
                    }}
                >
                    {(mutate, { data }) => (
                        <button data-testid="test" onClick={mutate}>
                            {data ? data.foo : 'no data'}
                        </button>
                    )}
                </Mutation>
            );
        };
        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return <Foo />;
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
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
            mytype: jest.fn(() =>
                Promise.reject({ message: 'provider error' })
            ),
        };

        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store, history }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            historyForAssertions = history;
                            return (
                                <Mutation
                                    type="mytype"
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
                                    {(mutate, { error }) => (
                                        <button
                                            data-testid="test"
                                            onClick={mutate}
                                        >
                                            {error ? error.message : 'no data'}
                                        </button>
                                    )}
                                </Mutation>
                            );
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
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

    it('supports onFailure side effects using hooks', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        let dispatchSpy;
        const dataProvider = {
            mytype: jest.fn(() =>
                Promise.reject({ message: 'provider error' })
            ),
        };

        const Foo = () => {
            const notify = useNotify();
            return (
                <Mutation
                    type="mytype"
                    resource="foo"
                    options={{
                        onFailure: () => {
                            notify('Damn!', { type: 'warning' });
                        },
                    }}
                >
                    {(mutate, { error }) => (
                        <button data-testid="test" onClick={mutate}>
                            {error ? error.message : 'no data'}
                        </button>
                    )}
                </Mutation>
            );
        };
        let getByTestId;
        act(() => {
            const res = render(
                <DataProviderContext.Provider value={dataProvider}>
                    <TestContext>
                        {({ store }) => {
                            dispatchSpy = jest.spyOn(store, 'dispatch');
                            return <Foo />;
                        }}
                    </TestContext>
                </DataProviderContext.Provider>
            );
            getByTestId = res.getByTestId;
        });

        const testElement = getByTestId('test');
        fireEvent.click(testElement);
        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Damn!', 'warning')
            );
        });
    });
});
