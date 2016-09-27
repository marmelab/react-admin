import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import { Edit } from './Edit';
import TextInput from '../input/TextInput';

describe('<Edit />', () => {
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
        const wrapper = shallow(<Edit {...defaultProps} />);

        const inputs = wrapper.find('TextInput');
        assert.equal(inputs.length, 0);
    });

    it('should display its child if it contains only a single child', () => {
        const wrapper = shallow(<Edit {...defaultProps}>
            <TextInput source="foo" />
        </Edit>);

        const inputs = wrapper.find('TextInput');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['foo']);
    });

    it('should display all its children if it contains many', () => {
        const wrapper = shallow(<Edit {...defaultProps}>
            <TextInput source="foo" />
            <TextInput source="bar" />
        </Edit>);

        const inputs = wrapper.find('TextInput');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['foo', 'bar']);
    });
});
