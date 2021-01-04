import * as React from 'react';
import { fireEvent, render, wait, cleanup } from '@testing-library/react';
import { Form } from 'react-final-form';
import expect from 'expect';

import AutocompleteArrayInput from './AutocompleteArrayInput';
import { TestTranslationProvider } from 'ra-core';

describe('<AutocompleteArrayInput />', () => {
    const defaultProps = {
        source: 'tags',
        resource: 'posts',
    };

    afterEach(cleanup);

    it('should extract suggestions from choices', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();
        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[
                            { id: 't', foobar: 'Technical' },
                            { id: 'p', foobar: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            { id: 't', foobar: { name: 'Technical' } },
                            { id: 'p', foobar: { name: 'Programming' } },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[
                            { id: 't', foobar: 'Technical' },
                            { id: 'p', foobar: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <TestTranslationProvider translate={x => `**${x}**`}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                        />
                    </TestTranslationProvider>
                )}
            />
        );
        const input = getByLabelText('**resources.posts.fields.tags**');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('**Technical**')).not.toBeNull();
        expect(getByText('**Programming**')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <TestTranslationProvider translate={x => `**${x}**`}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                            translateChoice={false}
                        />
                    </TestTranslationProvider>
                )}
            />
        );

        const input = getByLabelText('**resources.posts.fields.tags**');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        const { getByLabelText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                        shouldRenderSuggestions={v => v.length > 2}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();
        fireEvent.change(input, { target: { value: 'Te' } });
        expect(queryAllByRole('option')).toHaveLength(0);

        fireEvent.change(input, { target: { value: 'Tec' } });
        await wait(() => {
            expect(queryAllByRole('option')).toHaveLength(1);
        });
    });

    describe('Fix issue #1410', () => {
        it('should not fail when value is empty and new choices are applied', () => {
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 't', name: 'Technical' }]}
                        />
                    )}
                />
            );

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 't', name: 'Technical' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.tags'
            ) as HTMLInputElement;
            expect(input.value).toEqual('');
        });

        it('should repopulate the suggestions after the suggestions are dismissed', () => {
            const { getByLabelText, queryAllByRole } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 't', name: 'Technical' }]}
                        />
                    )}
                />
            );

            const input = getByLabelText('resources.posts.fields.tags');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);

            input.blur();
            input.focus();
            fireEvent.change(input, { target: { value: '' } });
            expect(queryAllByRole('option')).toHaveLength(1);
        });

        it('should not rerender searchText while having focus and new choices arrive', () => {
            const optionText = jest.fn();
            const { getByLabelText, queryAllByRole, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            meta={{ active: true }}
                            choices={[{ id: 't', name: 'Technical' }]}
                            optionText={v => {
                                optionText(v);
                                return v.name;
                            }}
                        />
                    )}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.tags'
            ) as HTMLInputElement;

            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            meta={{ active: true }}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                            optionText={v => {
                                optionText(v);
                                return v.name;
                            }}
                        />
                    )}
                />
            );

            expect(input.value).toEqual('foo');
        });

        it('should revert the searchText on blur', () => {
            const { getByLabelText, queryAllByRole } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 't', name: 'Technical' }]}
                        />
                    )}
                />
            );

            const input = getByLabelText(
                'resources.posts.fields.tags'
            ) as HTMLInputElement;

            input.focus();
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);
            input.blur();
            expect(input.value).toEqual('');
        });

        it('should show the suggestions when the input value is empty and the input is focused and choices arrived late', () => {
            const { getByLabelText, queryAllByRole, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => <AutocompleteArrayInput {...defaultProps} />}
                />
            );
            rerender(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                        />
                    )}
                />
            );

            const input = getByLabelText('resources.posts.fields.tags');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            expect(queryAllByRole('option')).toHaveLength(2);
        });

        it('should resolve value from input value', () => {
            const onChange = jest.fn();
            const { getByLabelText, getByRole } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            onChange={onChange}
                            choices={[{ id: 't', name: 'Technical' }]}
                        />
                    )}
                />
            );

            const input = getByLabelText('resources.posts.fields.tags');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            fireEvent.change(input, { target: { value: 'Technical' } });
            fireEvent.click(getByRole('option'));
            input.blur();

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(['t']);
        });

        it('should reset filter when input value changed', async () => {
            const setFilter = jest.fn();
            let formApi;
            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ tags: ['t'] }}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <AutocompleteArrayInput
                                {...defaultProps}
                                choices={[
                                    { id: 't', name: 'Technical' },
                                    { id: 'p', name: 'Programming' },
                                ]}
                                setFilter={setFilter}
                            />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.posts.fields.tags');
            fireEvent.change(input, { target: { value: 'p' } });
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenCalledWith('p');
            formApi.change('tags', ['p']);
            await wait(() => {
                expect(setFilter).toHaveBeenCalledTimes(3);
                expect(setFilter).toHaveBeenCalledWith('');
            });
        });

        it('should reset filter only when needed, even if the value is an array of objects (fixes #4454)', async () => {
            const setFilter = jest.fn();
            let formApi;
            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ tags: [{ id: 't' }] }}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <AutocompleteArrayInput
                                {...defaultProps}
                                choices={[
                                    { id: 't', name: 'Technical' },
                                    { id: 'p', name: 'Programming' },
                                ]}
                                parse={value =>
                                    value && value.map(v => ({ id: v }))
                                }
                                format={value => value && value.map(v => v.id)}
                                setFilter={setFilter}
                            />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.posts.fields.tags');
            fireEvent.change(input, { target: { value: 'p' } });
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenCalledWith('p');
            formApi.change('tags', ['p']);
            await wait(() => {
                expect(setFilter).toHaveBeenCalledTimes(3);
                expect(setFilter).toHaveBeenCalledWith('');
            });
        });

        it('should allow customized rendering of suggesting item', () => {
            const SuggestionItem = ({ record }: { record?: any }) => (
                <div aria-label={record.name} />
            );

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                            optionText={<SuggestionItem />}
                            matchSuggestion={(filter, choice) => true}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.tags');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            expect(getByLabelText('Technical')).not.toBeNull();
            expect(getByLabelText('Programming')).not.toBeNull();
        });
    });

    it('should display helperText', () => {
        const { getByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                )}
            />
        );
        expect(getByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
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
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.tags');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            input.blur();

            expect(queryByText('ra.validation.error')).not.toBeNull();
        });
    });

    describe('Fix issue #2121', () => {
        it('updates suggestions when input is blurred and refocused', () => {
            const { getByLabelText, queryAllByRole } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
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
            const input = getByLabelText('resources.posts.fields.tags');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();
            fireEvent.change(input, { target: { value: 'ab' } });
            expect(queryAllByRole('option')).toHaveLength(2);
            input.blur();

            input.focus();
            fireEvent.change(input, { target: { value: 'ab' } });
            expect(queryAllByRole('option')).toHaveLength(2);
        });
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        const onChange = jest.fn();

        const { getByLabelText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(queryAllByRole('option')).toHaveLength(1);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('passes options.suggestionsContainerProps to the suggestions container', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'ab' }]}
                        options={{
                            suggestionsContainerProps: {
                                'aria-label': 'Me',
                            },
                        }}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        expect(getByLabelText('Me')).not.toBeNull();
    });

    it('should limit suggestions when suggestionLimit is passed', () => {
        const { getByLabelText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        suggestionLimit={1}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();
        expect(queryAllByRole('option')).toHaveLength(1);
    });
});
