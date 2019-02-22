import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';
import expect from 'expect';
import Mutation from './Mutation';
import TestContext from './TestContext';

describe('Mutation', () => {
    afterEach(cleanup);

    it('should render its child', () => {
        const { getByTestId } = render(
            <TestContext>
                {() => (
                    <Mutation type="foo" resource="bar">
                        {() => <div data-testid="test">Hello</div>}
                    </Mutation>
                )}
            </TestContext>
        );
        expect(getByTestId('test').textContent).toBe('Hello');
    });
    it('should pass a callback to trigger the mutation', () => {
        let callback = null;
        render(
            <TestContext>
                {() => (
                    <Mutation type="foo" resource="bar">
                        {mutate => {
                            callback = mutate;
                            return <div data-testid="test">Hello</div>;
                        }}
                    </Mutation>
                )}
            </TestContext>
        );
        expect(callback).toBeInstanceOf(Function);
    });
    it('should dispatch a fetch action when the mutation callback is triggered', () => {
        let dispatchSpy;
        const myPayload = {};
        const { getByText } = render(
            <TestContext>
                {({ store }) => {
                    dispatchSpy = jest.spyOn(store, 'dispatch');
                    return (
                        <Mutation
                            type="mytype"
                            resource="myresource"
                            payload={myPayload}
                        >
                            {mutate => <button onClick={mutate}>Hello</button>}
                        </Mutation>
                    );
                }}
            </TestContext>
        );
        fireEvent.click(getByText('Hello'));
        const action = dispatchSpy.mock.calls[0][0];
        expect(action.type).toEqual('CUSTOM_FETCH');
        expect(action.payload).toEqual(myPayload);
        expect(action.meta.fetch).toEqual('mytype');
        expect(action.meta.resource).toEqual('myresource');
    });
    it('should update the loading state when the mutation callback is triggered', () => {
        const myPayload = {};
        const { getByText } = render(
            <TestContext>
                {({ store }) => (
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
                )}
            </TestContext>
        );
        expect(getByText('Hello').className).toEqual('idle');
        fireEvent.click(getByText('Hello'));
        expect(getByText('Hello').className).toEqual('loading');
    });
    // it('should update the data state after a success response');
    // it('should update the error state after an error response');
});
