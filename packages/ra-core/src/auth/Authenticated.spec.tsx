import React from 'react';
import expect from 'expect';
import { cleanup } from 'react-testing-library';

import Authenticated from './Authenticated';
import { userCheck } from '../actions/authActions';
import renderWithRedux from '../util/renderWithRedux';

describe('<Authenticated>', () => {
    afterEach(cleanup);
    const Foo = () => <div>Foo</div>;
    it('should call userCheck on mount', () => {
        const { dispatch } = renderWithRedux(
            <Authenticated>
                <Foo />
            </Authenticated>
        );
        expect(dispatch).toBeCalledWith(userCheck({}, '/'));
    });
    it('should call userCheck on update', () => {
        const FooWrapper = props => (
            <Authenticated {...props}>
                <Foo />
            </Authenticated>
        );
        const { dispatch, rerender } = renderWithRedux(<FooWrapper />);
        rerender(<FooWrapper authParams={{ foo: 'bar' }} />);
        expect(dispatch).toBeCalledTimes(2);
        expect(dispatch.mock.calls[1][0]).toEqual(
            userCheck({ foo: 'bar' }, '/')
        );
    });
    it('should render its child by default', () => {
        const { queryByText } = renderWithRedux(
            <Authenticated>
                <Foo />
            </Authenticated>
        );
        expect(queryByText('Foo')).toBeDefined();
    });
});
