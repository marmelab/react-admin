import React from 'react';
import assert from 'assert';
import { render, shallow } from 'enzyme';
import FunctionField from './FunctionField';

describe('<FunctionField />', () => {
    it('should render using the render function', () => {
        const record = { foo: 'bar' };
        const wrapper = render(
            <FunctionField record={record} render={r => r.foo.substr(0, 2)} />
        );
        assert.equal(wrapper.text(), 'ba');
    });

    it('should use custom className', () =>
        assert.deepEqual(
            shallow(
                <FunctionField
                    record={{ foo: true }}
                    render={r => r.foo.substr(0, 2)}
                    className="foo"
                />
            ).prop('className'),
            'foo'
        ));
});
