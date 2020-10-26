import * as React from 'react';
import {
    render,
    cleanup,
    fireEvent,
    waitForDomChange,
} from '@testing-library/react';
import expect from 'expect';

import Mutation from './Mutation';
import { CoreAdmin, Resource } from '../core';
import renderWithRedux from '../util/renderWithRedux';
import { DataProviderContext } from '.';

describe('useMutation', () => {
    afterEach(cleanup);

    it('should pass a callback to trigger the mutation', () => {
        let callback = null;
        renderWithRedux(
            <Mutation type="foo" resource="bar">
                {mutate => {
                    callback = mutate;
                    return <div data-testid="test">Hello</div>;
                }}
            </Mutation>
        );
        expect(callback).toBeInstanceOf(Function);
    });

    it('should dispatch a fetch action when the mutation callback is triggered', () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const myPayload = {};
        const { getByText, dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Mutation
                    type="mytype"
                    resource="myresource"
                    payload={myPayload}
                >
                    {mutate => <button onClick={mutate}>Hello</button>}
                </Mutation>
            </DataProviderContext.Provider>
        );
        fireEvent.click(getByText('Hello'));
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should use callTimePayload and callTimeOptions', () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const myPayload = { foo: 1 };
        const { getByText, dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Mutation
                    type="mytype"
                    resource="myresource"
                    payload={myPayload}
                >
                    {mutate => (
                        <button
                            onClick={e =>
                                mutate({ payload: { bar: 2 } }, { meta: 'baz' })
                            }
                        >
                            Hello
                        </button>
                    )}
                </Mutation>
            </DataProviderContext.Provider>
        );
        fireEvent.click(getByText('Hello'));
        const action = dispatch.mock.calls[0][0];
        expect(action.payload).toEqual({ foo: 1, bar: 2 });
        expect(action.meta.meta).toEqual('baz');
    });

    it('should update the loading state when the mutation callback is triggered', () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const myPayload = {};
        const { getByText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Mutation
                    type="mytype"
                    resource="myresource"
                    payload={myPayload}
                >
                    {(mutate, { loading }) => (
                        <button
                            className={loading ? 'loading' : 'idle'}
                            onClick={mutate}
                        >
                            Hello
                        </button>
                    )}
                </Mutation>
            </DataProviderContext.Provider>
        );
        expect(getByText('Hello').className).toEqual('idle');
        fireEvent.click(getByText('Hello'));
        expect(getByText('Hello').className).toEqual('loading');
    });

    it('should update the data state after a success response', async () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const Foo = () => (
            <Mutation type="mytype" resource="foo">
                {(mutate, { data }) => (
                    <button data-testid="test" onClick={mutate}>
                        {data ? data.foo : 'no data'}
                    </button>
                )}
            </Mutation>
        );
        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );
        const testElement = getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });
        expect(testElement.textContent).toEqual('bar');
    });

    it('should update the error state after an error response', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        const dataProvider = {
            mytype: jest.fn(() =>
                Promise.reject({ message: 'provider error' })
            ),
        };
        const Foo = () => (
            <Mutation type="mytype" resource="foo">
                {(mutate, { error }) => (
                    <button data-testid="test" onClick={mutate}>
                        {error ? error.message : 'no data'}
                    </button>
                )}
            </Mutation>
        );
        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );
        const testElement = getByTestId('test');
        expect(testElement.textContent).toBe('no data');
        fireEvent.click(testElement);
        await waitForDomChange({ container: testElement });
        expect(testElement.textContent).toEqual('provider error');
    });

    it('should allow custom dataProvider methods without resource', () => {
        const dataProvider = {
            mytype: jest.fn(() => Promise.resolve({ data: { foo: 'bar' } })),
        };

        const myPayload = {};
        const { getByText, dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <Mutation type="mytype" payload={myPayload}>
                    {mutate => <button onClick={mutate}>Hello</button>}
                </Mutation>
            </DataProviderContext.Provider>
        );
        fireEvent.click(getByText('Hello'));
        const action = dispatch.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.meta.resource).toBeUndefined();
        expect(dataProvider.mytype).toHaveBeenCalledWith(myPayload);
    });
});
