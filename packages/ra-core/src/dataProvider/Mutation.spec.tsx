import * as React from 'react';
import { fireEvent, waitFor, act, render } from '@testing-library/react';
import expect from 'expect';

import Mutation from './Mutation';
import { showNotification } from '../actions';
import DataProviderContext from './DataProviderContext';
import { renderWithRedux, TestContext } from 'ra-test';
import { useNotify } from '../sideEffect';

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
        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Youhou!', 'info', {
                    messageArgs: {},
                    undoable: false,
                })
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
        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                showNotification('Damn!', 'warning', {
                    messageArgs: {},
                    undoable: false,
                })
            );
        });
    });
});
