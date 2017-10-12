import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { CheckboxGroupInputComponent as CheckboxGroupInput } from './CheckboxGroupInput';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        choices: [{ id: 1, name: 'John doe' }],
        input: {
            onChange: () => {},
            value: [],
        },
        translate: x => x,
        muiTheme: {
            baseTheme: {},
            textField: {},
            prepareStyles: () => {},
        },
    };

    it('should use a mui Checkbox', () => {
        const wrapper = shallow(<CheckboxGroupInput {...defaultProps} />);
        const CheckboxElement = wrapper.find('Checkbox');
        assert.equal(CheckboxElement.length, 1);
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                input={{ value: [1], onChange: () => {} }}
            />
        );
        const CheckboxElement = wrapper.find('Checkbox').first();
        assert.equal(CheckboxElement.prop('checked'), true);
    });

    it('should render choices as mui Checkbox components', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                choices={[
                    { id: 'ang', name: 'Angular' },
                    { id: 'rct', name: 'React' },
                ]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        assert.equal(CheckboxElements.length, 2);
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'ang');
        assert.equal(CheckboxElement1.prop('label'), 'Angular');
        const CheckboxElement2 = CheckboxElements.at(1);
        assert.equal(CheckboxElement2.prop('value'), 'rct');
        assert.equal(CheckboxElement2.prop('label'), 'React');
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                optionValue="foobar"
                choices={[{ foobar: 'foo', name: 'Bar' }]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'foo');
        assert.equal(CheckboxElement1.prop('label'), 'Bar');
    });

    it('should use optionValue including "." as value identifier', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'foo' }, name: 'Bar' }]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'foo');
        assert.equal(CheckboxElement1.prop('label'), 'Bar');
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'foo', foobar: 'Bar' }]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'foo');
        assert.equal(CheckboxElement1.prop('label'), 'Bar');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'foo', foobar: { name: 'Bar' } }]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'foo');
        assert.equal(CheckboxElement1.prop('label'), 'Bar');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'foo', foobar: 'Bar' }]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'foo');
        assert.equal(CheckboxElement1.prop('label'), 'Bar');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                optionText={<Foobar />}
                choices={[{ id: 'foo', foobar: 'Bar' }]}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('value'), 'foo');
        assert.deepEqual(
            CheckboxElement1.prop('label'),
            <Foobar record={{ id: 'foo', foobar: 'Bar' }} />
        );
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translate={x => `**${x}**`}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('label'), '**Male**');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(
            <CheckboxGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translate={x => `**${x}**`}
                translateChoice={false}
            />
        );
        const CheckboxElements = wrapper.find('Checkbox');
        const CheckboxElement1 = CheckboxElements.first();
        assert.equal(CheckboxElement1.prop('label'), 'Male');
    });
});
