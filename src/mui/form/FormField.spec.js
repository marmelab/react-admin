import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

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
});
