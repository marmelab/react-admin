import React from 'react';
import PropTypes from 'prop-types';
import assert from 'assert';
import { shallow, render, mount } from 'enzyme';

import { AutocompleteInput } from './AutocompleteInput';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a react Autosuggest', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                input={{ value: 1 }}
                choices={[{ id: 1, name: 'hello' }]}
            />
        );
        const AutoCompleteElement = wrapper.find('Autosuggest');
        assert.equal(AutoCompleteElement.length, 1);
    });

    it('should use the input parameter value as the initial state and input searchText', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                input={{ value: 2 }}
                choices={[{ id: 2, name: 'foo' }]}
            />
        );
        const AutoCompleteElement = wrapper.find('Autosuggest').first();
        assert.equal(AutoCompleteElement.prop('inputProps').value, 'foo');
        assert.equal(wrapper.state('searchText'), 'foo');
    });

    it('should extract suggestions from choices', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        expect(wrapper.state('suggestions')).toEqual([
            { id: 'M', name: 'Male' },
            { id: 'F', name: 'Female' },
        ]);
    });

    it('should use optionValue as value identifier', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                optionValue="foobar"
                input={{ value: 'M' }}
                choices={[{ foobar: 'M', name: 'Male' }]}
            />
        );
        const AutoCompleteElement = wrapper.find('Autosuggest').first();
        assert.equal(AutoCompleteElement.prop('inputProps').value, 'Male');
    });

    it('should use optionValue including "." as value identifier', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                optionValue="foobar.id"
                input={{ value: 'M' }}
                choices={[{ foobar: { id: 'M' }, name: 'Male' }]}
            />
        );
        const AutoCompleteElement = wrapper.find('Autosuggest').first();
        assert.equal(AutoCompleteElement.prop('inputProps').value, 'Male');
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
        const wrapper = shallow(
            <AutocompleteInput {...defaultProps} optionText="foobar" />,
            { context, childContextTypes }
        );

        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion(
                { id: 'M', foobar: 'Male' },
                { query: '', highlighted: false }
            );

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );

        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion(
                { id: 'M', foobar: { name: 'Male' } },
                { query: '', highlighted: false }
            );

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );

        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion(
                { id: 'M', foobar: 'Male' },
                { query: '', highlighted: false }
            );

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should translate the choices by default', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion(
                { id: 'M', name: 'Male' },
                { query: '', highlighted: false }
            );

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), '**Male**');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                translateChoice={false}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        // This is necesary because we use the material-ui Popper element which does not includes
        // its children in the AutocompleteInput dom hierarchy
        const menuItem = wrapper
            .instance()
            .renderSuggestion(
                { id: 'M', name: 'Male' },
                { query: '', highlighted: false }
            );

        const MenuItem = render(menuItem);
        assert.equal(MenuItem.text(), 'Male');
    });

    describe('Fix issue #1410', () => {
        it('should not fail when value is null and new choices are applied', () => {
            const wrapper = shallow(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: null }}
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
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: null }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    alwaysRenderSuggestions
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('focus');
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
            expect(wrapper.state('searchText')).toBe('foo');
            expect(wrapper.state('suggestions')).toHaveLength(0);
            wrapper.find('input').simulate('blur');
            wrapper.find('input').simulate('change', { target: { value: '' } });
            expect(wrapper.state('suggestions')).toHaveLength(1);
        });

        it('should allow optionText to be a function', () => {
            const optionText = jest.fn();
            mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 'M' }}
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
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 'M' }}
                    meta={{ active: true }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    optionText={v => {
                        optionText(v);
                        return v.name;
                    }}
                />,
                { context, childContextTypes }
            );
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });

            wrapper.setProps({
                choices: [
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ],
            });
            expect(wrapper.state('searchText')).toBe('foo');
        });

        it('should allow input value to be cleared when allowEmpty is true and input text is empty', () => {
            const onBlur = jest.fn();
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    allowEmpty
                    input={{ value: 'M', onBlur }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />,
                { context, childContextTypes }
            );
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });

            wrapper.find('input').simulate('blur');
            expect(onBlur).toHaveBeenCalledTimes(1);
            expect(onBlur).toHaveBeenLastCalledWith('M');

            expect(wrapper.state('searchText')).toBe('Male');
            wrapper.find('input').simulate('change', { target: { value: '' } });
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('searchText')).toBe('');
            expect(onBlur).toHaveBeenCalledTimes(2);
            expect(onBlur).toHaveBeenLastCalledWith(null);
        });

        it('should revert the searchText when allowEmpty is false', () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 'M' }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />,
                { context, childContextTypes }
            );
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
            expect(wrapper.state('searchText')).toBe('foo');
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('searchText')).toBe('Male');
        });

        it('should show the suggestions when the input value is null and the input is focussed and choices arrived late', () => {
            const wrapper = mount(
                <AutocompleteInput {...defaultProps} input={{ value: '' }} />,
                { context, childContextTypes }
            );
            wrapper.setProps({
                choices: [
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ],
            });
            wrapper.find('input').simulate('focus');
            expect(wrapper.find('ListItem')).toHaveLength(2);
        });

        it('should resolve value from input value', () => {
            const onChange = jest.fn();
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: '', onChange }}
                />,
                { context, childContextTypes }
            );
            wrapper.setProps({
                choices: [{ id: 'M', name: 'Male' }],
            });
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'male' } });
            expect(wrapper.state('searchText')).toBe('Male');
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith('M');
        });

        it('should reset filter when input value changed', () => {
            const setFilter = jest.fn();
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 1 }}
                    setFilter={setFilter}
                />,
                { context, childContextTypes }
            );
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'de' } });
            expect(setFilter).toHaveBeenCalledTimes(1);
            expect(setFilter).toHaveBeenCalledWith('de');
            wrapper.setProps({
                input: { value: 2 },
            });
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenLastCalledWith('');
        });

        it('should allow customized rendering of suggesting item', () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 1 }}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    alwaysRenderSuggestions
                    suggestionComponent={({
                        suggestion,
                        query,
                        isHighlighted,
                        ...props
                    }) => <div {...props} data-field={suggestion.name} />}
                />,
                { context, childContextTypes }
            );
            expect(wrapper.find('div[data-field]')).toHaveLength(2);
        });
    });

    it('should displayed helperText if prop is present in meta', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                meta={{ helperText: 'Can i help you?' }}
            />
        );
        const AutoCompleteElement = wrapper.find('Autosuggest').first();
        assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
            helperText: 'Can i help you?',
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: false }}
                />
            );
            const AutoCompleteElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
                touched: false,
            });
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const AutoCompleteElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(AutoCompleteElement.prop('inputProps').meta, {
                touched: true,
                error: false,
            });
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
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
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: null }}
                    choices={[
                        { id: 1, name: 'ab' },
                        { id: 2, name: 'abc' },
                        { id: 3, name: '123' },
                    ]}
                />,
                { context, childContextTypes }
            );
            wrapper.find('input').simulate('focus');
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'a' } });
            expect(wrapper.state('suggestions')).toHaveLength(2);
            wrapper.find('input').simulate('blur');
            wrapper.find('input').simulate('focus');
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'a' } });
            expect(wrapper.state('suggestions')).toHaveLength(2);
        });
    });

    it('does not automatically select a matched choice if there are more than one', () => {
        const wrapper = mount(
            <AutocompleteInput
                {...defaultProps}
                input={{ value: null }}
                choices={[
                    { id: 1, name: 'ab' },
                    { id: 2, name: 'abc' },
                    { id: 3, name: '123' },
                ]}
            />,
            { context, childContextTypes }
        );
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: 'ab' } });
        expect(wrapper.state('suggestions')).toHaveLength(2);
    });

    it('automatically selects a matched choice if there is only one', () => {
        const onChange = jest.fn();

        const wrapper = mount(
            <AutocompleteInput
                {...defaultProps}
                input={{ value: null, onChange }}
                choices={[
                    { id: 1, name: 'ab' },
                    { id: 2, name: 'abc' },
                    { id: 3, name: '123' },
                ]}
            />,
            { context, childContextTypes }
        );
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: 'abc' } });
        expect(wrapper.state('suggestions')).toHaveLength(1);
        expect(onChange).toHaveBeenCalledWith(2);
    });
});
