import React from 'react';
import PropTypes from 'prop-types';
import {
    render,
    cleanup,
    fireEvent,
    waitForDomChange,
} from '@testing-library/react';

import AutocompleteInput from './index';
import { Form } from 'react-final-form';
import { TranslationContext } from 'ra-core';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'role',
        resource: 'users',
    };

    afterEach(cleanup);

    it('should use a Downshift', () => {
        const { getByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'hello' }]}
                    />
                )}
            />
        );
        expect(getByRole('combobox')).not.toBeNull();
    });

    it('should use the input parameter value as the initial state and input searchText', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionValue as value identifier', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[{ foobar: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionValue including "." as value identifier', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[{ foobar: { id: 2 }, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
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
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[{ id: 2, foobar: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[{ id: 2, foobar: { name: 'foo' } }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[{ id: 2, foobar: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should translate the value by default', () => {
        const { queryByDisplayValue } = render(
            <TranslationContext.Provider
                value={{
                    translate: x => `**${x}**`,
                }}
            >
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            </TranslationContext.Provider>
        );
        expect(queryByDisplayValue('**foo**')).not.toBeNull();
    });

    it('should not translate the value if translateChoice is false', () => {
        const { queryByDisplayValue } = render(
            <TranslationContext.Provider
                value={{
                    translate: x => `**${x}**`,
                }}
            >
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            translateChoice={false}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            </TranslationContext.Provider>
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
        expect(queryByDisplayValue('**foo**')).toBeNull();
    });

    it('should show the suggestions on focus', async () => {
        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        await waitForDomChange();
        expect(queryByText('foo')).not.toBeNull();
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        shouldRenderSuggestions={() => false}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        await waitForDomChange();
        expect(queryByText('foo')).toBeNull();
    });

    describe('Fix issue #1410', () => {
        it('should not fail when value is null and new choices are applied', () => {
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            expect(input.value).toEqual('');
            fireEvent.focus(input);

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'bar' }]}
                        />
                    )}
                />
            );

            expect(input.value).toEqual('');
        });

        it('should repopulate the suggestions after the suggestions are dismissed', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'bar' } });
            expect(queryByText('foo')).toBeNull();

            fireEvent.blur(input);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryByText('foo')).not.toBeNull();
        });

        it('should not rerender searchtext while having focus and new choices arrive', () => {
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.change(input, { target: { value: 'foo' } });

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'bar' }]}
                        />
                    )}
                />
            );

            expect(input.value).toEqual('foo');
        });

        it('should allow input value to be cleared when allowEmpty is true and input text is empty', () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            onChange={onChange}
                            allowEmpty
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'foo' } });
            fireEvent.blur(input);
            expect(onChange).toHaveBeenCalledWith(2);

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            expect(onChange).toHaveBeenCalledWith(null);
        });

        it('should revert the searchText when allowEmpty is false', () => {
            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'bar' } });
            fireEvent.blur(input);
            expect(input.value).toEqual('foo');
        });

        it('should show the suggestions when the input value is null and the input is focussed and choices arrived late', () => {
            const { getByLabelText, queryByText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => <AutocompleteInput {...defaultProps} />}
                />
            );

            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );
            expect(queryByText('foo')).not.toBeNull();
            expect(queryByText('bar')).not.toBeNull();
        });

        it('should reset filter when input value changed', () => {
            const setFilter = jest.fn();
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            setFilter={setFilter}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.change(input, { target: { value: 'bar' } });
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenCalledWith('bar');

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 1 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            setFilter={setFilter}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );
            expect(setFilter).toHaveBeenCalledTimes(3);
            expect(setFilter).toHaveBeenCalledWith('');
        });

        it('should allow customized rendering of suggesting item', () => {
            const { getByLabelText, queryByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            suggestionComponent={React.forwardRef(
                                (
                                    {
                                        suggestion,
                                        query,
                                        isHighlighted,
                                        ...props
                                    },
                                    ref
                                ) => (
                                    <div
                                        {...props}
                                        ref={ref}
                                        aria-label={suggestion.name}
                                    />
                                )
                            )}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );

            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);
            expect(queryByLabelText('bar')).not.toBeNull();
            expect(queryByLabelText('foo')).not.toBeNull();
        });
    });

    it('should display helperText if specified', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        helperText="Can i help you?"
                        choices={[{ id: 1, name: 'hello' }]}
                    />
                )}
            />
        );
        expect(queryByText('Can i help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            expect(queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);
            fireEvent.blur(input);

            expect(queryByText('ra.validation.error')).not.toBeNull();
        });
    });

    describe('Fix issue #2121', () => {
        it('updates suggestions when input is blurred and refocused', () => {
            const { queryAllByRole, getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 1, name: 'ab' },
                                { id: 2, name: 'abc' },
                                { id: 3, name: '123' },
                            ]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'a' } });
            expect(queryAllByRole('option').length).toEqual(2);
            fireEvent.blur(input);

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'a' } });
            expect(queryAllByRole('option').length).toEqual(2);
        });
    });

    it('does not automatically select a matched choice if there are more than one', () => {
        const { queryAllByRole, getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(queryAllByRole('option').length).toEqual(2);
    });

    it('does not automatically select a matched choice if there is only one', () => {
        const { queryAllByRole, getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(queryAllByRole('option').length).toEqual(1);
    });

    it('passes options.suggestionsContainerProps to the suggestions container', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        options={{
                            suggestionsContainerProps: {
                                'aria-label': 'My Sugggestions Container',
                            },
                        }}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);

        expect(getByLabelText('My Sugggestions Container')).not.toBeNull();
    });
});
