import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { SimpleForm } from './SimpleForm';
import TextInput from '../input/TextInput';

describe('<SimpleForm />', () => {
    it('should embed a SimpleFormFactory with given component children', () => {
        const wrapper = shallow(
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="city" />
            </SimpleForm>
        );
        const inputs = wrapper.find('WithFormField');
        assert.deepEqual(inputs.map(i => i.prop('source')), ['name', 'city']);
    });
});
