import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { FormField } from './FormField';

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
    it('should not initialize the form if no default value', () => {
        const initializeForm = jest.fn();
        shallow(
            <FormField
                source="title"
                initializeForm={initializeForm}
                component={Foo}
            />,
            { lifecycleExperimental: true }
        );
        assert.equal(initializeForm.mock.calls.length, 0);
    });
    it('should initialize the form with default value on mount', () => {
        const initializeForm = jest.fn();
        shallow(
            <FormField
                source="title"
                initializeForm={initializeForm}
                component={Foo}
                defaultValue={2}
            />,
            { lifecycleExperimental: true }
        );
        assert.equal(initializeForm.mock.calls.length, 1);
        assert.deepEqual(initializeForm.mock.calls[0][0], { title: 2 });
    });
    it('should not render a <Field /> component the field has an input', () => {
        const wrapper = shallow(
            <FormField initializeForm={() => true} component={Foo} input={{}} />
        );
        const component = wrapper.find('Field');
        assert.equal(component.length, 0);
    });
});
