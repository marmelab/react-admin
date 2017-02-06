import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import CheckboxGroupInput from './CheckboxGroupInput';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        choices: [
            { id: 1, name: 'John doe' },
        ],
        input: {
            onChange: () => {},
            value: [],
        },
    };

    it('should use a mui Checkbox', () => {
        const wrapper = shallow(<CheckboxGroupInput {...defaultProps} />);
        const CheckboxElement = wrapper.find('Checkbox');
        assert.equal(CheckboxElement.length, 1);
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(<CheckboxGroupInput {...defaultProps} input={{ value: [{ id: 1 }] }} />);
        const CheckboxElement = wrapper.find('Checkbox').first();
        assert.equal(CheckboxElement.prop('checked'), true);
    });

    it('should render choices as mui Checkbox components', () => {
        const wrapper = shallow(<CheckboxGroupInput
            {...defaultProps}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
        />);
        const CheckboxElements = wrapper.find('Checkbox');
        assert.equal(CheckboxElements.length, 2);
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'M');
        assert.equal(CheckboxElement1.prop('label'), 'Male');
        const CheckboxElement2 = CheckboxElements.at(1);
        assert.equal(CheckboxElement2.prop('value'), 'F');
        assert.equal(CheckboxElement2.prop('label'), 'Female');
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(<CheckboxGroupInput
            {...defaultProps}
            optionValue="foobar"
            choices={[
                { foobar: 'M', name: 'Male' },
            ]}
        />);
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'M');
        assert.equal(CheckboxElement1.prop('label'), 'Male');
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(<CheckboxGroupInput
            {...defaultProps}
            optionText="foobar"
            choices={[
                { id: 'M', foobar: 'Male' },
            ]}
        />);
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'M');
        assert.equal(CheckboxElement1.prop('label'), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(<CheckboxGroupInput
            {...defaultProps}
            optionText={choice => choice.foobar}
            choices={[
                { id: 'M', foobar: 'Male' },
            ]}
        />);
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'M');
        assert.equal(CheckboxElement1.prop('label'), 'Male');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const wrapper = shallow(<CheckboxGroupInput
            {...defaultProps}
            optionText={<Foobar />}
            choices={[
                { id: 'M', foobar: 'Male' },
            ]}
        />);
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'M');
        assert.deepEqual(CheckboxElement1.prop('label'), <Foobar record={{ id: 'M', foobar: 'Male' }} />);
    });
});
