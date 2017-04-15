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
        const inputs = wrapper.find('FormField');
        assert.deepEqual(inputs.map(i => i.prop('input').props.source), ['name', 'city']);
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

    it('should not pass handleSubmit to the form and pass submitOnEnter to <Toolbar /> when submitOnEnter is false', () => {
        const handleSubmit = () => {};
        const wrapper = shallow(
            <SimpleForm submitOnEnter={false} handleSubmit={handleSubmit}>
                <TextInput source="name" />
            </SimpleForm>
        );
        const form = wrapper.find('form');
        assert.notStrictEqual(form.prop('onSubmit'), handleSubmit);

        const button = wrapper.find('Toolbar');
        assert.equal(button.prop('submitOnEnter'), false);
    });

    it('should pass handleSubmit to the form and pass submitOnEnter to <Toolbar /> when submitOnEnter is true', () => {
        const handleSubmit = () => {};
        const wrapper = shallow(
            <SimpleForm submitOnEnter={true} handleSubmit={handleSubmit}>
                <TextInput source="name" />
            </SimpleForm>
        );
        const form = wrapper.find('form');
        assert.strictEqual(form.prop('onSubmit'), handleSubmit);

        const button = wrapper.find('Toolbar');
        assert.strictEqual(button.prop('submitOnEnter'), true);
    });
});
