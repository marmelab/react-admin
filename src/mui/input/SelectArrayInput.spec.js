import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { isElement } from 'react-dom/test-utils';
import { SelectArrayInput } from './SelectArrayInput';

describe('<SelectArrayInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {
            onChange: () => true,
        },
        translate: x => x,
        onCreateInline: () => true,
        setFilter: () => true,
        choices: [
            {
                id: 1,
                name: 'tag 1',
            },
            {
                id: 2,
                name: 'tag 2',
            },
        ],
    };

    it('should use a ChipInput', () => {
        const wrapper = shallow(<SelectArrayInput {...defaultProps} />);
        const ChipInputElement = wrapper.find('ChipInput');
        assert.equal(ChipInputElement.length, 1);
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = shallow(<SelectArrayInput {...defaultProps} choices={[]} input={{ value: [1, 2] }} />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('value'), [{ value: 1, text: 1 }, { value: 2, text: 2 }]);
    });

    it('should pass choices to the ChipInput as dataSource', () => {
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            choices={[
                { id: 1, name: 'Book' },
                { id: 2, name: 'Video' },
                { id: 3, name: 'Audio' },
            ]}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
            { value: 3, text: 'Audio' },
        ]);
    });

    it('should use the dataSource to set the initial input value', () => {
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            input={{ value: [1, 2] }}
            choices={[
                { id: 1, name: 'Book' },
                { id: 2, name: 'Video' },
                { id: 3, name: 'Audio' },
            ]}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('value'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
        ]);
    });

    it('should update the value when the dataSource updates', () => {
        const input = { value: [1, 2] };
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            input={input}
        />);
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
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            optionValue="foobar"
            choices={[
                { foobar: 'B', name: 'Book' },
            ]}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            optionText="foobar"
            choices={[
                { id: 'B', foobar: 'Book' },
            ]}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            optionText={choice => choice.foobar}
            choices={[
                { id: 'B', foobar: 'Book' },
            ]}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 'B', text: 'Book' },
        ]);
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            choices={[
                { id: 1, name: 'Book' },
                { id: 2, name: 'Video' },
                { id: 3, name: 'Audio' },
            ]}
            translate={x => `**${x}**`}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 1, text: '**Book**' },
            { value: 2, text: '**Video**' },
            { value: 3, text: '**Audio**' },
        ]);
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(<SelectArrayInput
            {...defaultProps}
            choices={[
                { id: 1, name: 'Book' },
                { id: 2, name: 'Video' },
                { id: 3, name: 'Audio' },
            ]}
            translate={x => `**${x}**`}
            translateChoice={false}
        />);
        const ChipInputElement = wrapper.find('ChipInput').first();
        assert.deepEqual(ChipInputElement.prop('dataSource'), [
            { value: 1, text: 'Book' },
            { value: 2, text: 'Video' },
            { value: 3, text: 'Audio' },
        ]);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(<SelectArrayInput {...defaultProps} meta={{ touched: false }} />);
            const ChipInputElement = wrapper.find('ChipInput');
            assert.equal(ChipInputElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(<SelectArrayInput {...defaultProps} meta={{ touched: true, error: false }} />);
            const ChipInputElement = wrapper.find('ChipInput');
            assert.equal(ChipInputElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(<SelectArrayInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />);
            const ChipInputElement = wrapper.find('ChipInput');
            assert.equal(ChipInputElement.prop('errorText'), 'Required field.');
        });
    });

    describe('create inline behavior', () => {
        const getWrapper = props => shallow((
            <SelectArrayInput
                {...defaultProps}
                {...props}
            />
        ));

        describe('.getChoices', () => {
            describe('when there is an onCreateInline handler', () => {
                it('should add the create button as the first choice if current text does not match any of the choices', () => {
                    const wrapper = getWrapper();
                    const instance = wrapper.instance();
                    wrapper.setState({ currentValue: 'some tag' });
                    const choices = instance.getChoices();
                    assert.equal(choices.length, 3);
                    assert.equal(choices[0].text, 'some tag');
                    assert(isElement(choices[0].value));
                });

                it('should not add the create button choice if current text matches any of the choices', () => {
                    const wrapper = getWrapper();
                    const instance = wrapper.instance();
                    wrapper.setState({ currentValue: 'tag 1' });
                    const choices = instance.getChoices();
                    assert.equal(isElement(choices[0].value), false);
                });
            });

            describe('when there is no onCreateInline handler', () => {
                it('should never add the create button choice', () => {
                    const wrapper = getWrapper({ onCreateInline: null });
                    const instance = wrapper.instance();
                    wrapper.setState({ currentValue: 'some tag' });
                    const choices = instance.getChoices();
                    assert.equal(choices.length, 2);
                    assert.equal(isElement(choices[0].value), false);
                });
            });
        });

        describe('.handleAdd', () => {
            describe('when there is an onCreateInline handler', () => {
                describe('when value does not exist in choices', () => {
                    it('should call onCreateInline with correct arguments', () => {
                        const onCreateInline = sinon.spy();
                        const wrapper = getWrapper({ onCreateInline });
                        const instance = wrapper.instance();
                        wrapper.setState({ currentValue: 'some tag' });
                        instance.handleAdd({ text: 'some tag' });
                        assert(onCreateInline.calledWith({
                            name: 'some tag',
                        }, instance.handleCreatedRecord));
                    });

                    it('should reset current text input', () => {
                        const wrapper = getWrapper();
                        const instance = wrapper.instance();
                        instance.handleAdd({ text: 'some tag' });
                        assert.equal(wrapper.state('currentValue'), '');
                    });
                });

                describe('when value exists in choices', () => {
                    it('should add new value to values in state', () => {
                        const wrapper = getWrapper();
                        const instance = wrapper.instance();
                        instance.handleAdd({ text: 'tag 1' });
                        assert.deepEqual(wrapper.state('values'), [{ text: 'tag 1' }]);
                    });
                });
            });
        });

        describe('.handleCreatedRecord', () => {
            it('should add the new record to values in state', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                instance.handleCreatedRecord({ id: 1, name: 'some tag' });
                assert.deepEqual(wrapper.state('values'), [{ text: 'some tag', value: 1 }]);
            });
        });
    });
});
