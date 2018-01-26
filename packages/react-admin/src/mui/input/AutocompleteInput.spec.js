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
        const wrapper = render(
            <AutocompleteInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'M', foobar: 'Male' }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = render(
            <AutocompleteInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = render(
            <AutocompleteInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should translate the choices by default', () => {
        const wrapper = render(
            <AutocompleteInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), '**Male**');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const wrapper = render(
            <AutocompleteInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                translateChoice={false}
                alwaysRenderSuggestions={true}
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
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
                />
            );
            wrapper.find('input').simulate('focus');
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
            expect(wrapper.state('searchText')).toBe('foo');
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('suggestions')).toHaveLength(0);
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
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
                />
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
                />
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
        it('should allow input value to be cleared when allowEmpty is true', () => {
            const onChange = jest.fn();
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    allowEmpty
                    input={{ value: 'M', onChange }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(null);
        });
        it('should revert the searchText when allowEmpty is false', () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 'M' }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
            expect(wrapper.state('searchText')).toBe('foo');
            wrapper.find('input').simulate('blur');
            expect(wrapper.state('searchText')).toBe('Male');
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
});
