import React from 'react';
import { cleanup } from '@testing-library/react';
import expect from 'expect';
import Mutation from './Mutation';
import renderWithRedux from '../util/renderWithRedux';

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
});
