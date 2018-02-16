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
            />
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
            />
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

    it('should call initializeForm if a defaultValue is set', () => {
        const initializeForm = jest.fn();
        shallow(
            <FormField
                component={Foo}
                source="bar"
                defaultValue="foo"
                initializeForm={initializeForm}
            />
        );
        assert.equal(initializeForm.mock.calls.length, 1);
        assert.deepEqual(initializeForm.mock.calls[0][0], { bar: 'foo' });
    });

    it('should call initializeForm if a defaultValue changes', () => {
        const initializeForm = jest.fn();
        const wrapper = shallow(
            <FormField
                component={Foo}
                source="bar"
                defaultValue="foo"
                initializeForm={initializeForm}
            />
        );
        assert.equal(initializeForm.mock.calls.length, 1);
        assert.deepEqual(initializeForm.mock.calls[0][0], { bar: 'foo' });

        wrapper.setProps({ defaultValue: 'bar', initializeForm });

        assert.equal(initializeForm.mock.calls.length, 2);
        assert.deepEqual(initializeForm.mock.calls[1][0], { bar: 'bar' });
    });
});
