import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { Show } from './Show';
import TextField from '../field/TextField';

describe('<Show />', () => {
    const defaultProps = {
        data: {},
        crudGetOne: () => {},
        crudUpdate: () => {},
        hasDelete: false,
        id: 'foo',
        isLoading: false,
        location: { pathname: '' },
        params: {},
        resource: '',
    };

    it('should display correctly even with no child', () => {
        const wrapper = shallow(<Show {...defaultProps} />);

        const inputs = wrapper.find('TextField');
        assert.equal(inputs.length, 0);
    });

    it('should display its child if it contains only a single child', () => {
        const wrapper = shallow(<Show {...defaultProps}>
            <TextField source="foo" />
        </Show>);

        const inputs = wrapper.find('TextField');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['foo']);
    });

    it('should display all its children if it contains many', () => {
        const wrapper = shallow(<Show {...defaultProps}>
            <TextField source="foo" />
            <TextField source="bar" />
        </Show>);

        const inputs = wrapper.find('TextField');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['foo', 'bar']);
    });
});
