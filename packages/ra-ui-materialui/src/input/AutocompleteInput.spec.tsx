import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    FormDataConsumer,
    testDataProvider,
    TestTranslationProvider,
} from 'ra-core';
import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';

import { AutocompleteInput } from './AutocompleteInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import { InsideReferenceInput } from './AutocompleteInput.stories';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'role',
        resource: 'users',
    };

    it('should set AutocompleteInput value to an empty string when the selected item is null', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: null }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(screen.queryByDisplayValue('')).not.toBeNull();
        });
    });

    it('should use the input value as the initial state and input searchText', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionValue as value identifier', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[
                            { foobar: 2, name: 'foo' },
                            { foobar: 3, name: 'bar' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionValue including "." as value identifier', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[
                            { foobar: { id: 2 }, name: 'foo' },
                            { foobar: { id: 3 }, name: 'bar' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a string value as text identifier', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[
                            { id: 2, foobar: 'foo' },
                            { id: 3, foobar: 'bar' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();

        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a string value including "." as text identifier', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            { id: 2, foobar: { name: 'foo' } },
                            { id: 3, foobar: { name: 'bar' } },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a function value as text identifier', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[
                            { id: 2, foobar: 'foo' },
                            { id: 3, foobar: 'bar' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();

        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should translate the value by default', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 2, name: 'foo' },
                                { id: 3, name: 'bar' },
                            ]}
                        />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('**foo**')).not.toBeNull();
        fireEvent.focus(
            screen.getByLabelText('**resources.users.fields.role**')
        );
        await waitFor(() => {
            expect(screen.queryByText('**bar**')).not.toBeNull();
        });
    });

    it('should not translate the value if translateChoice is false', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            translateChoice={false}
                            choices={[
                                { id: 2, name: 'foo' },
                                { id: 3, name: 'bar' },
                            ]}
                        />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        expect(screen.queryByDisplayValue('**foo**')).toBeNull();
        fireEvent.focus(
            screen.getByLabelText('**resources.users.fields.role**')
        );
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
            expect(screen.queryByText('**bar**')).toBeNull();
        });
    });

    it('should show the suggestions on focus', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 2, name: 'foo' },
                            { id: 3, name: 'bar' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        fireEvent.focus(screen.getByLabelText('resources.users.fields.role'));
        await waitFor(() => {
            expect(screen.queryByText('bar')).not.toBeNull();
        });
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        shouldRenderSuggestions={() => false}
                        noOptionsText="No options"
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        await waitFor(() => {
            expect(screen.queryByText('foo')).toBeNull();
        });
    });

    it('should not fail when value is null and new choices are applied', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: null }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;
        expect(input.value).toEqual('');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: null }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(input.value).toEqual('');
    });

    it('should repopulate the suggestions after the suggestions are dismissed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: null }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'bar' } });
        await waitFor(() => {
            expect(screen.queryByText('foo')).toBeNull();
        });

        fireEvent.blur(input);
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });

        await waitFor(() => {
            expect(screen.queryByText('foo')).not.toBeNull();
        });
    });

    it('should not rerender searchText while having focus and new choices arrive', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: null }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(input.value).toEqual('foo');

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: null }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'bar' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(input.value).toEqual('foo');
    });

    it('should show the suggestions when the input value is null and the input is focussed and choices arrived late', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByText('bar', {
                selector: '[role="option"]',
            })
        ).not.toBeNull();
    });

    it('should reset filter when input value changed', async () => {
        const setFilter = jest.fn();
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} record={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        setFilter={setFilter}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        userEvent.type(input, '{selectall}bar');
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(1);
        });
        expect(setFilter).toHaveBeenCalledWith('bar');

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} record={{ role: 1 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        setFilter={setFilter}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
        });
        expect(setFilter).toHaveBeenCalledWith('');
    });

    it('should allow customized rendering of suggesting item', () => {
        const SuggestionItem = ({ record, ...rest }: { record?: any }) => (
            <div {...rest} aria-label={record && record.name} />
        );

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 2 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        optionText={<SuggestionItem />}
                        matchSuggestion={() => true}
                        inputText={record => record?.name}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        expect(screen.queryByLabelText('bar')).not.toBeNull();
    });

    it('should display helperText if specified', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 1 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        helperText="Can I help you?"
                        choices={[{ id: 1, name: 'hello' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 1 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            expect(screen.queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        onSubmit={jest.fn()}
                        mode="onBlur"
                        defaultValues={{ role: 1 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            fireEvent.click(
                screen.getByLabelText('ra.action.clear_input_value')
            );
            fireEvent.blur(
                screen.getByLabelText('resources.users.fields.role')
            );

            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.error')
                ).not.toBeNull();
            });
        });
    });

    it('updates suggestions when input is blurred and refocused', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');

        fireEvent.change(input, { target: { value: 'a' } });
        await waitFor(() => {
            expect(screen.queryAllByRole('option').length).toEqual(3);
        });
        fireEvent.blur(input);

        fireEvent.change(input, { target: { value: 'a' } });
        await waitFor(() => {
            expect(screen.queryAllByRole('option').length).toEqual(3);
        });
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        await waitFor(() =>
            expect(screen.queryAllByRole('option').length).toEqual(1)
        );
    });

    it('should accept 0 as an input value', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ role: 0 }}>
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 0, name: 'foo' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const handleCreate = filter => {
            const newChoice = {
                id: 'js_fatigue',
                name: filter,
            };
            choices.push(newChoice);
            return newChoice;
        };

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    onSubmit={jest.fn()}
                    defaultValues={{ language: 'ang' }}
                >
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    onSubmit={jest.fn()}
                    defaultValues={{ role: 2 }}
                >
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue('New Kid On The Block')
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        fireEvent.blur(input);
        fireEvent.focus(input);
        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const handleCreate = filter => {
            return new Promise(resolve => {
                const newChoice = {
                    id: 'js_fatigue',
                    name: filter,
                };
                choices.push(newChoice);
                setTimeout(() => resolve(newChoice), 100);
            });
        };

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    onSubmit={jest.fn()}
                    defaultValues={{ language: 'ang' }}
                >
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve, 100));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    onSubmit={jest.fn()}
                    defaultValues={{ role: 2 }}
                >
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue('New Kid On The Block')
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        fireEvent.blur(input);
        fireEvent.focus(input);
        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should support creation of a new choice through the create element', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    onSubmit={jest.fn()}
                    defaultValues={{ language: 'ang' }}
                >
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        fireEvent.click(screen.getByText('Get the kid'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    onSubmit={jest.fn()}
                    defaultValues={{ role: 2 }}
                >
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue('New Kid On The Block')
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        fireEvent.blur(input);
        fireEvent.focus(input);
        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should work inside a ReferenceInput field', async () => {
        render(<InsideReferenceInput />);
        await waitFor(() => {
            expect(
                (screen.getByRole('textbox') as HTMLInputElement).value
            ).toBe('Leo Tolstoy');
        });
        screen.getByRole('textbox').focus();
        fireEvent.click(screen.getByLabelText('Clear value'));
        await waitFor(() => {
            expect(screen.getByText('Victor Hugo'));
        });
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'Vic' },
        });
        await waitFor(() => {
            expect(screen.getByText('Victor Hugo'));
        });
        expect(screen.queryByText('Leo Tolstoy')).toBeNull();
    });

    it("should allow to edit the input if it's inside a FormDataConsumer", () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    mode="onBlur"
                    resource="posts"
                    onSubmit={jest.fn()}
                    defaultValues={{ role: 2 }}
                >
                    <FormDataConsumer>
                        {({ formData, ...rest }) => {
                            return (
                                <AutocompleteInput
                                    label="Id"
                                    choices={[
                                        {
                                            name: 'General Practitioner',
                                            id: 'GeneralPractitioner',
                                        },
                                        {
                                            name: 'Physiotherapist',
                                            id: 'Physiotherapist',
                                        },
                                        {
                                            name: 'Clinical Pharmacist',
                                            id: 'ClinicalPharmacist',
                                        },
                                    ]}
                                    source="id"
                                />
                            );
                        }}
                    </FormDataConsumer>
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('Id', {
            selector: 'input',
        }) as HTMLInputElement;
        fireEvent.focus(input);
        userEvent.type(input, 'Hello World!');
        expect(input.value).toEqual('Hello World!');
    });
});
