import React from 'react';
import expect from 'expect';
import { cleanup } from 'react-testing-library';

import Authenticated from './Authenticated';
import AuthContext from './AuthContext';
import renderWithRedux from '../util/renderWithRedux';

describe('<Authenticated>', () => {
    afterEach(cleanup);
    const Foo = () => <div>Foo</div>;
    it('should call authProvider on mount', () => {
        const authProvider = jest.fn(() => Promise.resolve());
        renderWithRedux(
            <AuthContext.Provider value={authProvider}>
                <Authenticated>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
        );
        expect(authProvider).toBeCalledWith('AUTH_CHECK', { location: '/' });
    });
    it('should call authProvider on update', () => {
        const authProvider = jest.fn(() => Promise.resolve());
        const FooWrapper = props => (
            <AuthContext.Provider value={authProvider}>
                <Authenticated {...props}>
                    <Foo />
                </Authenticated>
            </AuthContext.Provider>
        );
        const { rerender } = renderWithRedux(<FooWrapper />);
        rerender(<FooWrapper authParams={{ foo: 'bar' }} />);
        expect(authProvider).toBeCalledTimes(2);
        expect(authProvider.mock.calls[1]).toEqual([
            'AUTH_CHECK',
            { foo: 'bar', location: '/' },
        ]);
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
