import React from 'react';
import assert from 'assert';
import { render, cleanup } from '@testing-library/react';
import FunctionField from './FunctionField';

describe('<FunctionField />', () => {
    afterEach(cleanup);

    it('should render using the render function', () => {
        const record = { foo: 'bar' };
        const { queryByText } = render(
            <FunctionField record={record} render={r => r.foo.substr(0, 2)} />
        );
        assert.notEqual(queryByText('ba'), null);
    });

    it('should use custom className', () => {
        const { queryByText } = render(
            <FunctionField
                record={{ foo: 'bar' }}
                render={r => r.foo}
                className="foo"
            />
        );
        assert.ok(queryByText('bar').classList.contains('foo'));
    });
});
