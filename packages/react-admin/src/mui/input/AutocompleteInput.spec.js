import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import assert from 'assert';
import { mount, shallow, render } from 'enzyme';

import { AutocompleteInput } from './AutocompleteInput';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        classes: {},
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
        const DownshiftElement = wrapper.find('Downshift').first();
        assert.equal(DownshiftElement.prop('inputValue'), 'Male');
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
        const wrapper = mount(
            <AutocompleteInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'M', foobar: 'Male' }]}
                isOpen
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const wrapper = mount(
            <AutocompleteInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
                isOpen
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), 'Male');
    });

    it('should use optionText with a function value as text identifier', () => {
        const wrapper = mount(
            <AutocompleteInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
                isOpen
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
                isOpen
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
                isOpen
            />,
            { context, childContextTypes }
        );
        const MenuItem = wrapper.find('div[role="menuitem"]').first();
        assert.equal(MenuItem.text(), 'Male');
    });

    describe('suggestions', () => {
        it("should only show the selected items in the suggestions list when there's no change in the searchText", () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 1, active: true }}
                    choices={[
                        { id: 1, name: 'Airplane' },
                        { id: 2, name: 'Train' },
                    ]}
                    isOpen
                />
            );
            expect(wrapper.find('ListItem')).toHaveLength(1);
        });
        it("should only show all the suggestions list when there's a change in the searchText", () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 1 }}
                    meta={{ active: true }} // Emulate the input as active
                    choices={[
                        { id: 1, name: 'Airplane' },
                        { id: 2, name: 'Train' },
                    ]}
                    setFilter={() => {}}
                    isOpen
                />
            );
            wrapper.find('input').simulate('change', { target: { value: '' } });
            expect(wrapper.find('ListItem')).toHaveLength(2);
        });
        it('should allow filter to narrow down suggestions', () => {
            const choices = [
                { id: 1, name: 'Airplane' },
                { id: 2, name: 'Train' },
                { id: 3, name: 'Car' },
            ];
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 1 }}
                    meta={{ active: true }} // Emulate the input as active
                    choices={[{ id: 1, name: 'Airplane' }]}
                    isOpen
                />
            );
            wrapper.setProps({
                setFilter: searchText =>
                    wrapper.setProps({
                        choices:
                            searchText === '' ? choices : choices.slice(0, 2),
                    }),
            });
            expect(wrapper.find('ListItem')).toHaveLength(1);
            wrapper.find('input').simulate('change', { target: { value: '' } });
            expect(wrapper.find('ListItem')).toHaveLength(3);
            wrapper
                .find('input')
                .simulate('change', { target: { value: 'foo' } });
            expect(wrapper.find('ListItem')).toHaveLength(2);
        });
        it('should allow selectedItem to be supplied separately from the choices', () => {
            const choices = [
                { id: 1, name: 'Airplane' },
                { id: 2, name: 'Train' },
            ];
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    input={{ value: 1 }}
                    selectedItem={choices[0]}
                    choices={choices.slice(1)}
                />
            );
            expect(wrapper.state('searchText')).toBe('Airplane');
        });
    });

    describe('properties', () => {
        describe('allowEmpty', () => {
            it('when true, changing the search text to a unknown choice should set the input value to null', () => {
                const onChange = jest.fn();
                const wrapper = mount(
                    <AutocompleteInput
                        {...defaultProps}
                        allowEmpty
                        input={{ value: 1, onChange }}
                        meta={{ active: true }}
                        selectedItem={{ id: 1, name: 'Airplane' }}
                        setFilter={() => {}}
                    />,
                    { context, childContextTypes }
                );
                wrapper
                    .find('input')
                    .simulate('change', { target: { value: 'foo' } });
                expect(onChange).toHaveBeenCalledTimes(1);
                expect(onChange).toHaveBeenCalledWith(null);
            });
            it('when false, changing the search text to a unknown choice should not set the input value to null', () => {
                const onChange = jest.fn();
                const wrapper = mount(
                    <AutocompleteInput
                        {...defaultProps}
                        input={{ value: 1, onChange }}
                        meta={{ active: true }}
                        selectedItem={{ id: 1, name: 'Airplane' }}
                        setFilter={() => {}}
                    />,
                    { context, childContextTypes }
                );
                wrapper
                    .find('input')
                    .simulate('change', { target: { value: 'foo' } });
                expect(onChange).toHaveBeenCalledTimes(0);
            });
            it('when true, changing the search text to a known choice should set the input value to null', () => {
                const onChange = jest.fn();
                const wrapper = mount(
                    <AutocompleteInput
                        {...defaultProps}
                        input={{ value: 1, onChange }}
                        meta={{ active: true }}
                        choices={[
                            { id: 1, name: 'Airplane' },
                            { id: 2, name: 'Train' },
                        ]}
                        setFilter={() => {}}
                    />,
                    { context, childContextTypes }
                );
                wrapper
                    .find('input')
                    .simulate('change', { target: { value: 'Train' } });
                expect(onChange).toHaveBeenCalledTimes(1);
                expect(onChange).toHaveBeenCalledWith(2);
            });
        });
        describe('setFilter', () => {
            it('should only be called when input is active', () => {
                const setFilter = jest.fn();
                const wrapper = mount(
                    <AutocompleteInput
                        {...defaultProps}
                        setFilter={setFilter}
                        input={{ value: 1 }}
                        choices={[{ id: 1, name: 'Airplane' }]}
                    />
                );
                wrapper
                    .find('input')
                    .simulate('change', { target: { value: 'foo' } });
                expect(setFilter).toHaveBeenCalledTimes(0);
                wrapper.setProps({ meta: { active: true } });
                wrapper
                    .find('input')
                    .simulate('change', { target: { value: 'bar' } });
                expect(setFilter).toHaveBeenCalledTimes(1);
            });
        });
        describe('optionComponent', () => {
            it('should receive suggestion record in optionComponent props', () => {
                const optionComponent = jest.fn();
                mount(
                    <AutocompleteInput
                        {...defaultProps}
                        optionComponent={props => {
                            optionComponent(props);
                            return <div {...props} />;
                        }}
                        input={{ value: 1 }}
                        choices={[{ id: 1, name: 'Airplane' }]}
                        isOpen
                    />
                );
                expect(optionComponent).toHaveBeenCalledTimes(1);
                expect(optionComponent).toHaveBeenCalledWith(
                    expect.objectContaining({
                        suggestion: { id: 1, name: 'Airplane' },
                    })
                );
            });
            it('should render the optionComponent when supplied', () => {
                const wrapper = mount(
                    <AutocompleteInput
                        {...defaultProps}
                        optionComponent={({ suggestion, ...props }) => (
                            <Typography {...props} />
                        )}
                        input={{ value: 1 }}
                        choices={[{ id: 1, name: 'Airplane' }]}
                        isOpen
                    />
                );
                expect(wrapper.find('Typography')).toHaveLength(1);
            });
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: false }}
                />
            );
            const TextFieldElement = wrapper.find('TextField').first();
            expect(TextFieldElement.prop('error')).toBe(false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const TextFieldElement = wrapper.find('TextField').first();
            expect(TextFieldElement.prop('error')).toBe(false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = mount(
                <AutocompleteInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const FormHelperText = wrapper.find('FormHelperText').first();
            expect(FormHelperText.text()).toBe('Required field.');
        });
    });
});
