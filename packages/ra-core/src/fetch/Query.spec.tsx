import React from 'react';
import {
    render,
    cleanup,
    act,
    // @ts-ignore
    waitForDomChange,
} from 'react-testing-library';
import expect from 'expect';
import Query from './Query';
import CoreAdmin from '../CoreAdmin';
import Resource from '../Resource';
import renderWithRedux from '../util/renderWithRedux';
import TestContext from '../util/TestContext';

describe('Query', () => {
    afterEach(cleanup);

    it('should render its child', () => {
        const { getByTestId } = renderWithRedux(
            <Query type="foo" resource="bar">
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
                <Query type="mytype" resource="myresource" payload={myPayload}>
                    {() => <div>Hello</div>}
                </Query>
            );

            dispatchSpy = result.dispatch;
        });

        const action = dispatchSpy.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.fetch).toEqual('mytype');
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should set the loading state to loading when mounting', () => {
        const myPayload = {};
        const { getByText } = renderWithRedux(
            <Query type="mytype" resource="myresource" payload={myPayload}>
                {({ loading }) => (
                    <div className={loading ? 'loading' : 'idle'}>Hello</div>
                )}
            </Query>
        );
        expect(getByText('Hello').className).toEqual('loading');
    });

    it('should update the data state after a success response', async () => {
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.resolve({ data: { foo: 'bar' } })
        );
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

        await waitForDomChange({ container: testElement });
        expect(testElement.textContent).toEqual('bar');
        expect(testElement.className).toEqual('idle');
    });

    it('should return the total prop if available', async () => {
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.resolve({ data: [{ foo: 'bar' }], total: 42 })
        );

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

        await waitForDomChange({ container: testElement });
        expect(testElement.className).toEqual('idle');
        expect(testElement.textContent).toEqual('42');
    });

    it('should update the error state after an error response', async () => {
        const dataProvider = jest.fn();
        dataProvider.mockImplementationOnce(() =>
            Promise.reject({ message: 'provider error' })
        );
        const Foo = () => (
            <Query type="mytype" resource="foo">
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

        await waitForDomChange({ container: testElement });
        expect(testElement.textContent).toEqual('provider error');
        expect(testElement.className).toEqual('idle');
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
                            type="mytype"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    );
                }}
            </TestContext>
        );
        const mySecondPayload = { foo: 1 };
        act(() => {
            rerender(
                <TestContext>
                    {() => (
                        <Query
                            type="mytype"
                            resource="myresource"
                            payload={mySecondPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    )}
                </TestContext>
            );
        });
        expect(dispatchSpy.mock.calls.length).toEqual(2);
        const action = dispatchSpy.mock.calls[1][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(mySecondPayload);
        expect(action.meta.fetch).toEqual('mytype');
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should not dispatch a new fetch action when updating with the same query props', () => {
        let dispatchSpy;
        const myPayload = {};
        const { rerender } = render(
            <TestContext>
                {({ store }) => {
                    dispatchSpy = jest.spyOn(store, 'dispatch');
                    return (
                        <Query
                            type="mytype"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    );
                }}
            </TestContext>
        );
        act(() => {
            rerender(
                <TestContext>
                    {() => (
                        <Query
                            type="mytype"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {() => <div>Hello</div>}
                        </Query>
                    )}
                </TestContext>
            );
        });
        expect(dispatchSpy.mock.calls.length).toEqual(1);
    });
});
