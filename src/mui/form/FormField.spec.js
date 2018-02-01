import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { FormFieldComponent as FormField } from './FormField';

describe('<FormField>', () => {
    const Foo = () => <div />;
    Foo.defaultProps = { source: 'bar' };
    it('should render the input component', () => {
        const wrapper = shallow(<FormField input={<Foo />} />);
        const component = wrapper.find('Foo');
        assert.equal(component.length, 1);
    });
    it("should render the input component even if it's an html element", () => {
        const wrapper = shallow(<FormField input={<div />} />);
        const component = wrapper.find('div');
        assert.equal(component.length, 1);
    });
    it('should not render <Field /> component by default', () => {
        const wrapper = shallow(<FormField input={<Foo />} />);
        const component = wrapper.find('Field');
        assert.equal(component.length, 0);
    });
    it('should render a <Field /> component when addField is true', () => {
        const wrapper = shallow(<FormField input={<Foo addField />} />);
        const component = wrapper.find('Field');
        assert.equal(component.length, 1);
    });
    it('should not render a <Labeled /> component when addField is true by default', () => {
        const wrapper = shallow(<FormField input={<Foo addField />} />);
        const component = wrapper.find('Field').prop('component').name;
        assert.equal(component, 'Foo');
    });
    it('should render a <Labeled /> component when addField is true and addLabel is true', () => {
        const wrapper = shallow(
            <FormField input={<Foo addField addLabel />} />
        );
        const component = wrapper.find('Field').prop('component').name;
        assert.equal(component, 'Labeled');
    });

    it('should not render a <Labeled /> component by default', () => {
        const wrapper = shallow(<FormField input={<Foo />} />);
        const component = wrapper.find('Labeled');
        assert.equal(component.length, 0);
    });
    it('should render a <Labeled /> component when addLabel is true', () => {
        const wrapper = shallow(<FormField input={<Foo addLabel />} />);
        const component = wrapper.find('Labeled');
        assert.equal(component.length, 1);
    });
    it('should not render a <Field /> component when addLabel is true by default', () => {
        const wrapper = shallow(<FormField input={<Foo addLabel />} />);
        const component = wrapper.find('Field');
        assert.equal(component.length, 0);
    });

    it('should call initializeForm if a defaultValue is set', () => {
        const initializeForm = sinon.spy();
        shallow(
            <FormField
                input={<Foo defaultValue="foo" />}
                initializeForm={initializeForm}
            />,
            { lifecycleExperimental: true }
        );
        assert(
            initializeForm.calledOnce,
            'initializeForm should have been called'
        );
        assert.deepEqual(initializeForm.args[0][0], { bar: 'foo' });
    });

    it('should call initializeForm if a defaultValue changes', () => {
        const initializeForm = sinon.spy();
        const wrapper = shallow(
            <FormField
                input={<Foo defaultValue="foo" />}
                initializeForm={initializeForm}
            />,
            { lifecycleExperimental: true }
        );
        assert(
            initializeForm.calledOnce,
            'initializeForm should have been called'
        );
        assert.deepEqual(initializeForm.args[0][0], { bar: 'foo' });

        wrapper.setProps({ input: <Foo defaultValue="bar" />, initializeForm });

        assert.equal(
            initializeForm.callCount,
            2,
            'initializeForm should have been called'
        );
        assert.deepEqual(initializeForm.args[1][0], { bar: 'bar' });
    });
});
