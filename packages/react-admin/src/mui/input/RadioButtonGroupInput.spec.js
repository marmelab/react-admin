import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { RadioButtonGroupInput } from './RadioButtonGroupInput';

describe('<RadioButtonGroupInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a mui RadioGroup', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput {...defaultProps} label="hello" />
        );
        const RadioGroupElement = wrapper.find('RadioGroup');
        assert.equal(RadioGroupElement.length, 1);
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput {...defaultProps} input={{ value: 2 }} />
        );
        const RadioGroupElement = wrapper.find('RadioGroup').first();
        assert.equal(RadioGroupElement.prop('defaultSelected'), '2');
    });

    it('should use the input parameter value as the selected value', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput {...defaultProps} input={{ value: 2 }} />
        );
        const RadioGroupElement = wrapper.find('RadioGroup').first();
        assert.equal(RadioGroupElement.prop('valueSelected'), '2');
    });

    it('should render choices as mui Radio components', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        assert.equal(RadioButtonElements.length, 2);
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
        const RadioButtonElement2 = RadioButtonElements.at(1);
        assert.equal(RadioButtonElement2.prop('value'), 'F');
        assert.equal(RadioButtonElement2.prop('label'), 'Female');
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                optionValue="foobar"
                choices={[{ foobar: 'M', name: 'Male' }]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });

    it('should use optionValue including "." as value identifier', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'M' }, name: 'Male' }]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText={<Foobar />}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('value'), 'M');
        assert.deepEqual(
            RadioButtonElement1.prop('label'),
            <Foobar record={{ id: 'M', foobar: 'Male' }} />
        );
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translate={x => `**${x}**`}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('label'), '**Male**');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translate={x => `**${x}**`}
                translateChoice={false}
            />
        );
        const RadioButtonElements = wrapper.find('WithStyles(Radio)');
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });
});
