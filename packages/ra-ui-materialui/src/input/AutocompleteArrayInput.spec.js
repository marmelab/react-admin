import React from 'react';
import PropTypes from 'prop-types';
import assert from 'assert';
import { shallow, render, mount } from 'enzyme';

import { AutocompleteArrayInput } from './AutocompleteArrayInput';

describe('<AutocompleteArrayInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: { onChange: () => {} },
        translate: x => x,
    };

    it('should use a react Autosuggest', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput {...defaultProps} input={{ value: [1] }} choices={[{ id: 1, name: 'hello' }]} />
        );
        const AutoCompleteElement = wrapper.find('Autosuggest');
        assert.equal(AutoCompleteElement.length, 1);
    });

    it('should extract suggestions from choices', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }]}
            />
        );
        expect(wrapper.state('suggestions')).toEqual([{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }]);
    });

    const context = {
        translate: () => 'translated',
        locale: 'en',
    };
    const childContextTypes = {
        translate: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
    };

    it('should use optionText with a string value as text identifier', () => {
        const wrapper = shallow(<AutocompleteArrayInput {...defaultProps} optionText="foobar" />, {
            context,
            childContextTypes,
        });

        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteArrayInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion({ id: 'M', foobar: 'Male' }, { query: '', highlighted: false });

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );

        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteArrayInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion({ id: 'M', foobar: { name: 'Male' } }, { query: '', highlighted: false });

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );

        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteArrayInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion({ id: 'M', foobar: 'Male' }, { query: '', highlighted: false });

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteArrayInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion({ id: 'M', name: 'Male' }, { query: '', highlighted: false });

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), '**Male**');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                translateChoice={false}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteArrayInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion({ id: 'M', name: 'Male' }, { query: '', highlighted: false });

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should respect shouldRenderSuggestions over default if passed in', () => {
        const wrapper = mount(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: ['M'], onChange: () => {} }}
                choices={[{ id: 'M', name: 'Male' }]}
                shouldRenderSuggestions={v => v.length > 2}
            />,
            { context, childContextTypes }
        );
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: 'Ma' } });
        expect(wrapper.state('suggestions')).toHaveLength(1);
        expect(wrapper.find('ListItem')).toHaveLength(0);

        wrapper.find('input').simulate('change', { target: { value: 'Mal' } });
        expect(wrapper.state('suggestions')).toHaveLength(1);
        expect(wrapper.find('ListItem')).toHaveLength(1);
    });

    describe('Fix issue #1410', () => {
        it('should not fail when value is empty and new choices are applied', () => {
            const wrapper = shallow(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );
            wrapper.setProps({
                choices: [{ id: 'M', name: 'Male' }],
            });
            expect(wrapper.state('searchText')).toBe('');
        });

        it('should repopulate the suggestions after the suggestions are dismissed', () => {
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    alwaysRenderSuggestions
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('change', { target: { value: 'foo' } });
            expect(wrapper.state('searchText')).toBe('foo');
            expect(wrapper.state('suggestions')).toHaveLength(0);
            wrapper.find('input').simulate('blur');
            wrapper.find('input').simulate('change', { target: { value: '' } });
            expect(wrapper.state('suggestions')).toHaveLength(1);
        });

        it('should allow optionText to be a function', () => {
            const optionText = jest.fn();
            mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: ['M'], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    optionText={v => {
                        optionText(v);
                        return v.name;
                    }}
                />,
                { context, childContextTypes }
            );
            expect(optionText).toHaveBeenCalledTimes(1);
            expect(optionText).toHaveBeenCalledWith({ id: 'M', name: 'Male' });
        });

        it('should not rerender searchtext while having focus and new choices arrive', () => {
            const optionText = jest.fn();
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: ['M'], onChange: () => {} }}
                    meta={{ active: true }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    optionText={v => {
                        optionText(v);
                        return v.name;
                    }}
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('change', { target: { value: 'foo' } });

            wrapper.setProps({
                choices: [{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }],
            });
            expect(wrapper.state('searchText')).toBe('foo');
        });

        it('should allow input value to be cleared when allowEmpty is true and input text is empty', () => {
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    allowEmpty
                    input={{ value: ['M'], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />,
                { context, childContextTypes }
            );

            wrapper.find('input').simulate('change', { target: { value: 'foo' } });
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('searchText')).toBe('');

            wrapper.find('input').simulate('change', { target: { value: '' } });
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('searchText')).toBe('');
        });

        it('should revert the searchText when allowEmpty is false', () => {
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: ['M'], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('change', { target: { value: 'foo' } });
            expect(wrapper.state('searchText')).toBe('foo');
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('searchText')).toBe('');
        });

        it('should show the suggestions when the input value is empty and the input is focussed and choices arrived late', () => {
            const wrapper = mount(
                <AutocompleteArrayInput {...defaultProps} input={{ value: [], onChange: () => {} }} />,
                { context, childContextTypes }
            );
            wrapper.setProps({
                choices: [{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }],
            });
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('ListItem')).toHaveLength(2);
        });

        it('should resolve value from input value', () => {
            const onChange = jest.fn();
            const wrapper = mount(<AutocompleteArrayInput {...defaultProps} input={{ value: [], onChange }} />, {
                context,
                childContextTypes,
            });
            wrapper.setProps({
                choices: [{ id: 'M', name: 'Male' }],
            });
            wrapper.find('input').simulate('change', { target: { value: 'male' } });
            wrapper.find('input').simulate('blur');

            expect.assertions(2);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        expect(onChange).toHaveBeenCalledTimes(1);
                        expect(onChange).toHaveBeenCalledWith(['M']);
                    } catch (error) {
                        return reject(error);
                    }
                    resolve();
                }, 250);
            });
        });

        it('should reset filter when input value changed', () => {
            const setFilter = jest.fn();
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [1] }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    setFilter={setFilter}
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('change', { target: { value: 'de' } });
            expect(setFilter).toHaveBeenCalledTimes(1);
            expect(setFilter).toHaveBeenCalledWith('de');
            wrapper.setProps({
                input: { value: [2] },
            });
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenLastCalledWith('');
        });

        it('should allow customized rendering of suggesting item', () => {
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [1] }}
                    choices={[{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }]}
                    alwaysRenderSuggestions
                    suggestionComponent={({ suggestion, query, isHighlighted, ...props }) => (
                        <div {...props} data-field={suggestion.name} />
                    )}
                />,
                { context, childContextTypes }
            );
            expect(wrapper.find('div[data-field]')).toHaveLength(2);
        });
    });

    it('should displayed helperText if prop is present in meta', () => {
        const wrapper = shallow(<AutocompleteArrayInput {...defaultProps} meta={{ helperText: 'Can i help you?' }} />);
        const AutoCompleteElement = wrapper.find('Autosuggest').first();
        assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
            helperText: 'Can i help you?',
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(<AutocompleteArrayInput {...defaultProps} meta={{ touched: false }} />);
            const AutoCompleteElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
                touched: false,
            });
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <AutocompleteArrayInput {...defaultProps} meta={{ touched: true, error: false }} />
            );
            const AutoCompleteElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
                touched: true,
                error: false,
            });
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <AutocompleteArrayInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />
            );
            const AutoCompleteElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
                touched: true,
                error: 'Required field.',
            });
        });
    });

    describe('Fix issue #2121', () => {
        it('updates suggestions when input is blurred and refocused', () => {
            const wrapper = mount(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[{ id: 1, name: 'ab' }, { id: 2, name: 'abc' }, { id: 3, name: '123' }]}
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('change', { target: { value: 'a' } });
            expect(wrapper.state('suggestions')).toHaveLength(2);
            wrapper.find('input').simulate('blur');
            wrapper.find('input').simulate('focus');
            wrapper.find('input').simulate('change', { target: { value: 'a' } });
            expect(wrapper.state('suggestions')).toHaveLength(2);
        });
    });

    it('does not automatically select a matched choice if there are more than one', () => {
        const wrapper = mount(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange: () => {} }}
                choices={[{ id: 1, name: 'ab' }, { id: 2, name: 'abc' }, { id: 3, name: '123' }]}
            />,
            { context, childContextTypes }
        );
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: 'ab' } });
        expect(wrapper.state('suggestions')).toHaveLength(2);
    });

    it('does not automatically select a matched choice if there is only one', () => {
        const onChange = jest.fn();

        const wrapper = mount(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange }}
                choices={[{ id: 1, name: 'ab' }, { id: 2, name: 'abc' }, { id: 3, name: '123' }]}
            />,
            { context, childContextTypes }
        );
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: 'abc' } });
        expect(wrapper.state('suggestions')).toHaveLength(1);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('automatically selects a matched choice on blur if there is only one', () => {
        const onChange = jest.fn();

        const wrapper = mount(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange }}
                choices={[{ id: 1, name: 'ab' }, { id: 2, name: 'abc' }, { id: 3, name: '123' }]}
            />,
            { context, childContextTypes }
        );
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: 'abc' } });
        wrapper.find('input').simulate('blur');

        expect.assertions(1);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    expect(onChange).toHaveBeenCalledWith([2]);
                } catch (error) {
                    return reject(error);
                }
                resolve();
            }, 250);
        });
    });

    it('passes options.suggestionsContainerProps to the suggestions container', () => {
        const onChange = jest.fn();

        const wrapper = mount(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange }}
                choices={[{ id: 1, name: 'ab' }, { id: 2, name: 'abc' }, { id: 3, name: '123' }]}
                options={{
                    suggestionsContainerProps: {
                        disablePortal: true,
                    },
                }}
            />,
            { context, childContextTypes }
        );
        expect(wrapper.find('Popper').props().disablePortal).toEqual(true);
    });
});
