import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { SimpleForm } from './SimpleForm';
import TextInput from '../input/TextInput';

describe('<SimpleForm />', () => {
    it('should embed a form with given component children', () => {
        const wrapper = shallow(
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="city" />
            </SimpleForm>
        );
        const inputs = wrapper.find('FormInput');
        assert.deepEqual(inputs.map(i => i.prop('input').props.source), [
            'name',
            'city',
        ]);
    });

    it('should display <Toolbar />', () => {
        const wrapper = shallow(
            <SimpleForm>
                <TextInput source="name" />
            </SimpleForm>
        );
        const button = wrapper.find('Toolbar');
        assert.equal(button.length, 1);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const wrapper1 = shallow(
            <SimpleForm submitOnEnter={false} handleSubmit={handleSubmit}>
                <TextInput source="name" />
            </SimpleForm>
        );
        const button1 = wrapper1.find('Toolbar');
        assert.equal(button1.prop('submitOnEnter'), false);

        const wrapper2 = shallow(
            <SimpleForm submitOnEnter={true} handleSubmit={handleSubmit}>
                <TextInput source="name" />
            </SimpleForm>
        );
        const button2 = wrapper2.find('Toolbar');
        assert.equal(button2.prop('submitOnEnter'), true);
    });
});
