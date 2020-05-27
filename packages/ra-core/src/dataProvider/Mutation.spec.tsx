import * as React from 'react';
import {
    cleanup,
    fireEvent,
    waitForDomChange,
    act,
    render,
} from '@testing-library/react';
import expect from 'expect';

import Mutation from './Mutation';
import renderWithRedux from '../util/renderWithRedux';
import { showNotification, refreshView, setListSelectedIds } from '../actions';
import DataProviderContext from './DataProviderContext';
import TestContext from '../util/TestContext';
import { useNotify } from '../sideEffect';
import { History } from 'history';

describe('Mutation', () => {
    afterEach(cleanup);

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
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Youhou!', 'info', {
                messageArgs: {},
                undoable: false,
            })
        );
        expect(historyForAssertions.location.pathname).toEqual('/a_path');
        expect(dispatchSpy).toHaveBeenCalledWith(refreshView());
        expect(dispatchSpy).toHaveBeenCalledWith(setListSelectedIds('foo', []));
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
                            notify('Youhou!', 'info');
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
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Youhou!', 'info', {
                messageArgs: {},
                undoable: false,
            })
        );
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
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Damn!', 'warning', {
                messageArgs: {},
                undoable: false,
            })
        );
        expect(historyForAssertions.location.pathname).toEqual('/a_path');
        expect(dispatchSpy).toHaveBeenCalledWith(refreshView());
        expect(dispatchSpy).toHaveBeenCalledWith(setListSelectedIds('foo', []));
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
                            notify('Damn!', 'warning');
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
        await waitForDomChange({ container: testElement });

        expect(dispatchSpy).toHaveBeenCalledWith(
            showNotification('Damn!', 'warning', {
                messageArgs: {},
                undoable: false,
            })
        );
    });
});
