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
            <RadioButtonGroupInput {...defaultProps} input={{ value: '2' }} />
        );
        const RadioGroupElement = wrapper.find('RadioGroup').first();
        assert.equal(RadioGroupElement.prop('value'), '2');
    });

    it('should use the input parameter value as the selected value', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput {...defaultProps} input={{ value: '2' }} />
        );
        const RadioGroupElement = wrapper.find('RadioGroup').first();
        assert.equal(RadioGroupElement.prop('value'), '2');
    });

    it('should render choices as mui FormControlLabel components with a Radio control', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
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
        const RadioButtonElements = wrapper.find(
            'WithStyles(FormControlLabel)'
        );
        const RadioButtonElement1 = RadioButtonElements.first();
        assert.equal(RadioButtonElement1.prop('label'), 'Male');
    });

    it('should displayed helperText if prop is present in meta', () => {
        const wrapper = shallow(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translate={x => `**${x}**`}
                translateChoice={false}
                meta={{ helperText: 'Can i help you?' }}
            />
        );
        const FormHelperTextElement = wrapper.find(
            'WithStyles(FormHelperText)'
        );
        assert.equal(FormHelperTextElement.length, 1);
        assert.equal(
            FormHelperTextElement.children().text(),
            'Can i help you?'
        );
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <RadioButtonGroupInput
                    {...defaultProps}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    translate={x => `**${x}**`}
                    translateChoice={false}
                    meta={{ touched: false }}
                />
            );
            const FormHelperTextElement = wrapper.find(
                'WithStyles(FormHelperText)'
            );
            assert.equal(FormHelperTextElement.length, 0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <RadioButtonGroupInput
                    {...defaultProps}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    translate={x => `**${x}**`}
                    translateChoice={false}
                    meta={{ touched: true, error: false }}
                />
            );
            const FormHelperTextElement = wrapper.find(
                'WithStyles(FormHelperText)'
            );
            assert.equal(FormHelperTextElement.length, 0);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <RadioButtonGroupInput
                    {...defaultProps}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    translate={x => `**${x}**`}
                    translateChoice={false}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const FormHelperTextElement = wrapper.find(
                'WithStyles(FormHelperText)'
            );
            assert.equal(FormHelperTextElement.length, 1);
            assert.equal(
                FormHelperTextElement.children().text(),
                'Required field.'
            );
        });

        it('should display the error and help text if helperText is present', () => {
            const wrapper = shallow(
                <RadioButtonGroupInput
                    {...defaultProps}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    translate={x => `**${x}**`}
                    translateChoice={false}
                    meta={{
                        touched: true,
                        error: 'Required field.',
                        helperText: 'Can i help you?',
                    }}
                />
            );
            const FormHelperTextElement = wrapper.find(
                'WithStyles(FormHelperText)'
            );
            assert.equal(FormHelperTextElement.length, 2);
            assert.equal(
                FormHelperTextElement.at(0)
                    .children(0)
                    .text(),
                'Required field.'
            );
            assert.equal(
                FormHelperTextElement.at(1)
                    .children(0)
                    .text(),
                'Can i help you?'
            );
        });
    });
});
