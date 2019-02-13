import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import { FormFieldView as FormField } from './FormField';

describe('<FormField>', () => {
    const Foo = () => <div />;
    it('should render a <Field/> component for the input component', () => {
        const wrapper = shallow(
            <FormField
                source="title"
                initializeForm={() => true}
                component={Foo}
            />
        );
        const component = wrapper.find('Field');
        assert.equal(component.length, 1);
        assert.equal(wrapper.prop('component'), Foo);
    });
    it('should not render a <Field /> component the field has an input', () => {
        const wrapper = shallow(
            <FormField initializeForm={() => true} component={Foo} input={{}} />
        );
        const component = wrapper.find('Field');
        assert.equal(component.length, 0);
    });
});
