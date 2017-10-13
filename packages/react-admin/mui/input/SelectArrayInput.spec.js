import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { SelectArrayInput } from './SelectArrayInput';

describe('<SelectArrayInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a ChipInput', () => {
        const wrapper = shallow(<SelectArrayInput {...defaultProps} />);
        const ChipInputElement = wrapper.find('ChipInput');
        assert.equal(ChipInputElement.length, 1);
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(
            <SelectArrayInput {...defaultProps} input={{ value: [1, 2] }} />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('value'), [
            { value: 1, text: 1 },
            { value: 2, text: 2 },
        ]);
    });

    it('should pass choices to the ChipInput as dataSource', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                choices={[
                    { id: 1, name: 'Book' },
                    { id: 2, name: 'Video' },
                    { id: 3, name: 'Audio' },
                ]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
            { value: 3, text: 'Audio' },
        ]);
    });

    it('should use the dataSource to set the initial input value', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                input={{ value: [1, 2] }}
                choices={[
                    { id: 1, name: 'Book' },
                    { id: 2, name: 'Video' },
                    { id: 3, name: 'Audio' },
                ]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('value'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
        ]);
    });

    it('should update the value when the dataSource updates', () => {
        const input = { value: [1, 2] };
        const wrapper = shallow(
            <SelectArrayInput {...defaultProps} input={input} />
        );
        wrapper.setProps({
            ...defaultProps,
            choices: [
                { id: 1, name: 'Book' },
                { id: 2, name: 'Video' },
                { id: 3, name: 'Audio' },
            ],
            input,
        });
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('value'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
        ]);
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionValue="foobar"
                choices={[{ foobar: 'B', name: 'Book' }]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should use optionValue including as value identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'B' }, name: 'Book' }]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'B', foobar: 'Book' }]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'B', foobar: { name: 'Book' } }]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'B', foobar: 'Book' }]}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                choices={[
                    { id: 1, name: 'Book' },
                    { id: 2, name: 'Video' },
                    { id: 3, name: 'Audio' },
                ]}
                translate={x => `**${x}**`}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 1, text: '**Book**' },
            { value: 2, text: '**Video**' },
            { value: 3, text: '**Audio**' },
        ]);
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(
            <SelectArrayInput
                {...defaultProps}
                choices={[
                    { id: 1, name: 'Book' },
                    { id: 2, name: 'Video' },
                    { id: 3, name: 'Audio' },
                ]}
                translate={x => `**${x}**`}
                translateChoice={false}
            />
        );
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
            { value: 3, text: 'Audio' },
        ]);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <SelectArrayInput {...defaultProps} meta={{ touched: false }} />
            );
            const ChipInputElement = wrapper.find('ChipInput');
            assert.equal(ChipInputElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <SelectArrayInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const ChipInputElement = wrapper.find('ChipInput');
            assert.equal(ChipInputElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <SelectArrayInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const ChipInputElement = wrapper.find('ChipInput');
            assert.equal(ChipInputElement.prop('errorText'), 'Required field.');
        });
    });
});
