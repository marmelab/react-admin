import React from 'react';
import PropTypes from 'prop-types';
import assert from 'assert';
import { shallow, render } from 'enzyme';

import { AutocompleteInput } from './AutocompleteInput';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    it('should use a Downshift component', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                input={{ value: 1 }}
                choices={[{ id: 1, name: 'hello' }]}
            />
        );
        const DownshiftElement = wrapper.find('Downshift');
        assert.equal(DownshiftElement.length, 1);
    });

    it('should use the input parameter value as the initial state and inputValue searchText', () => {
        const wrapper = shallow(
            <AutocompleteInput
                {...defaultProps}
                input={{ value: 2 }}
                choices={[{ id: 2, name: 'foo' }]}
            />
        );
        const DownshiftElement = wrapper.find('Downshift').first();
        assert.equal(DownshiftElement.prop('inputValue'), 'foo');
        assert.equal(wrapper.state('searchText'), 'foo');
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
        const DownshiftElement = wrapper.find('Autosuggest').first();
        assert.equal(DownshiftElement.prop('inputProps').value, 'Male');
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
        const DownshiftElement = wrapper.find('Downshift').first();
        assert.equal(DownshiftElement.prop('inputValue'), 'Male');
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

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: false }}
                />
            );
            const DownshiftElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(DownshiftElement.prop('inputProps').meta, {
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
            const DownshiftElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(DownshiftElement.prop('inputProps').meta, {
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
            const DownshiftElement = wrapper.find('Autosuggest').first();
            assert.deepEqual(DownshiftElement.prop('inputProps').meta, {
                touched: true,
                error: 'Required field.',
            });
        });
    });
});
