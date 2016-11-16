import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SelectInput from './SelectInput';

describe('<SelectInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
    };

    it('should use a mui SelectField', () => {
        const wrapper = shallow(<SelectInput {...defaultProps} label="hello" />);
        const SelectFieldElement = wrapper.find('SelectField');
        assert.equal(SelectFieldElement.length, 1);
        assert.equal(SelectFieldElement.prop('floatingLabelText'), 'hello');
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(<SelectInput {...defaultProps} input={{ value: 2 }} />);
        const SelectFieldElement = wrapper.find('SelectField').first();
        assert.equal(SelectFieldElement.prop('value'), '2');
    });

    it('should render choices as mui MenuItem components', () => {
        const wrapper = shallow(<SelectInput
            {...defaultProps}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
        />);
        const MenuItemElements = wrapper.find('MenuItem');
        assert.equal(MenuItemElements.length, 2);
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), 'M');
        assert.equal(MenuItemElement1.prop('primaryText'), 'Male');
        const MenuItemElement2 = MenuItemElements.at(1);
        assert.equal(MenuItemElement2.prop('value'), 'F');
        assert.equal(MenuItemElement2.prop('primaryText'), 'Female');
    });

    it('should add an empty menu when allowEmpty is true', () => {
        const wrapper = shallow(<SelectInput
            allowEmpty
            {...defaultProps}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
        />);
        const MenuItemElements = wrapper.find('MenuItem');
        assert.equal(MenuItemElements.length, 3);
        const MenuItemElement1 = MenuItemElements.first();
        assert.equal(MenuItemElement1.prop('value'), null);
        assert.equal(MenuItemElement1.prop('primaryText'), '');
    });
});
