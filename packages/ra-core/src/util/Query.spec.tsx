import React from 'react';
import {
    render,
    cleanup,
    fireEvent,
    // @ts-ignore
    waitForDomChange,
} from 'react-testing-library';
import expect from 'expect';
import Query from './Query';
import CoreAdmin from '../CoreAdmin';
import Resource from '../Resource';
import TestContext from './TestContext';

describe('Query', () => {
    afterEach(cleanup);

    it('should render its child', () => {
        const { getByTestId } = render(
            <TestContext>
                {() => (
                    <Query type="foo" resource="bar">
                        {() => <div data-testid="test">Hello</div>}
                    </Query>
                )}
            </TestContext>
        );
        expect(getByTestId('test').textContent).toBe('Hello');
    });

    it('should dispatch a fetch action when mounting', () => {
        let dispatchSpy;
        const myPayload = {};
        render(
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
        const action = dispatchSpy.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.fetch).toEqual('mytype');
        expect(action.meta.resource).toEqual('myresource');
    });

    it('should set the loading state to loading when mounting', () => {
        const myPayload = {};
        const { getByText } = render(
            <TestContext>
                {() => (
                    <Query
                        type="mytype"
                        resource="myresource"
                        payload={myPayload}
                    >
                        {({ loading }) => (
                            <div className={loading ? 'loading' : 'idle'}>
                                Hello
                            </div>
                        )}
                    </Query>
                )}
            </TestContext>
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
        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );
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

        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );

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
        const { getByTestId } = render(
            <CoreAdmin dataProvider={dataProvider}>
                <Resource name="foo" list={Foo} />
            </CoreAdmin>
        );
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
        expect(dispatchSpy.mock.calls.length).toEqual(2);
        const action = dispatchSpy.mock.calls[1][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(mySecondPayload);
        expect(action.meta.fetch).toEqual('mytype');
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
        rerender(
            <TestContext>
                {() => {
                    const myPayload = {
                        foo: {
                            bar: 1,
                        },
                    };
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
        expect(dispatchSpy.mock.calls.length).toEqual(1);
    });
});
