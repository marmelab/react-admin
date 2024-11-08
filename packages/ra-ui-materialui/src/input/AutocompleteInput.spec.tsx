import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    FormDataConsumer,
    ResourceContextProvider,
    required,
    testDataProvider,
    useRecordContext,
} from 'ra-core';
import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';

import { AutocompleteInput } from './AutocompleteInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import {
    DifferentShapeInGetMany,
    InsideReferenceInput,
    InsideReferenceInputDefaultValue,
    InsideReferenceInputWithCustomizedItemRendering,
    Basic,
    NullishValuesSupport,
    VeryLargeOptionsNumber,
    TranslateChoice,
    OnChange,
    InsideReferenceInputOnChange,
    WithInputProps,
    OnCreate,
    OnCreateSlow,
    CreateLabel,
    CreateItemLabel,
} from './AutocompleteInput.stories';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';

describe('<AutocompleteInput />', () => {
    const defaultProps = {
        source: 'role',
        resource: 'users',
    };

    it('should set AutocompleteInput value to an empty string when the selected item is null', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: null }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(screen.queryByDisplayValue('')).not.toBeNull();
        });
    });

    it('should use the input value as the initial state and input searchText', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should allow filter to match the selected choice while removing characters in the input', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 1, name: 'foo' },
                                { id: 2, name: 'bar' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;

        fireEvent.mouseDown(input);
        await waitFor(() => {
            expect(screen.getByText('foo')).not.toBe(null);
        });
        fireEvent.click(screen.getByText('foo'));
        await waitFor(() => {
            expect(input.value).toEqual('foo');
        });
        fireEvent.focus(input);
        userEvent.type(input, '{end}');
        userEvent.type(input, '2');
        await screen.findByDisplayValue('foo2');
        userEvent.type(input, '{backspace}');
        await waitFor(() => {
            expect(input.value).toEqual('foo');
        });
    });

    describe('emptyText', () => {
        it('should allow to have an empty menu option text by passing a string', () => {
            const emptyText = 'Default';

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <AutocompleteInput
                                emptyText={emptyText}
                                {...defaultProps}
                                choices={[{ id: 2, name: 'foo' }]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.users.fields.role')
            );

            expect(screen.queryAllByRole('option').length).toEqual(1);

            const input = screen.getByRole('combobox') as HTMLInputElement;

            expect(input.value).toEqual('Default');
        });

        it('should display the emptyText when input is not required', async () => {
            const emptyText = 'Default';
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 1 }}
                        >
                            <AutocompleteInput
                                emptyText={emptyText}
                                {...defaultProps}
                                choices={[]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.click(
                await screen.findByLabelText('resources.users.fields.role')
            );
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toEqual(1);
            });
            expect(screen.queryByText('Default')).not.toBeNull();
        });

        it('should not display the emptyText when validate equals required', async () => {
            const emptyText = 'Default';
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 1 }}
                        >
                            <AutocompleteInput
                                emptyText={emptyText}
                                {...defaultProps}
                                choices={[]}
                                validate={required()}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.click(
                await screen.findByLabelText('resources.users.fields.role *')
            );
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toEqual(0);
            });
            expect(screen.queryByText('Default')).toBeNull();
            await screen.findByText('No options');
        });

        it('should not display the emptyText when isRequired is true', async () => {
            const emptyText = 'Default';
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 1 }}
                        >
                            <AutocompleteInput
                                emptyText={emptyText}
                                {...defaultProps}
                                choices={[]}
                                isRequired
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.click(
                await screen.findByLabelText('resources.users.fields.role *')
            );
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toEqual(0);
            });
            expect(screen.queryByText('Default')).toBeNull();
            await screen.findByText('No options');
        });
    });

    describe('optionValue', () => {
        it('should use optionValue as value identifier', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionValue="foobar"
                                choices={[
                                    { foobar: 2, name: 'foo' },
                                    { foobar: 3, name: 'bar' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByDisplayValue('foo')).not.toBeNull();
            fireEvent.focus(
                screen.getByLabelText('resources.users.fields.role')
            );
            await waitFor(() => {
                expect(screen.queryByText('bar')).not.toBeNull();
            });
        });

        it('should use optionValue including "." as value identifier', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionValue="foobar.id"
                                choices={[
                                    { foobar: { id: 2 }, name: 'foo' },
                                    { foobar: { id: 3 }, name: 'bar' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByDisplayValue('foo')).not.toBeNull();
            fireEvent.focus(
                screen.getByLabelText('resources.users.fields.role')
            );
            await waitFor(() => {
                expect(screen.queryByText('bar')).not.toBeNull();
            });
        });
    });

    describe('optionText', () => {
        it('should use optionText with a string value as text identifier', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionText="foobar"
                                choices={[
                                    { id: 2, foobar: 'foo' },
                                    { id: 3, foobar: 'bar' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByDisplayValue('foo')).not.toBeNull();

            fireEvent.focus(
                screen.getByLabelText('resources.users.fields.role')
            );
            await waitFor(() => {
                expect(screen.queryByText('bar')).not.toBeNull();
            });
        });

        it('should use optionText with a string value including "." as text identifier', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionText="foobar.name"
                                choices={[
                                    { id: 2, foobar: { name: 'foo' } },
                                    { id: 3, foobar: { name: 'bar' } },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByDisplayValue('foo')).not.toBeNull();
            fireEvent.focus(
                screen.getByLabelText('resources.users.fields.role')
            );
            await waitFor(() => {
                expect(screen.queryByText('bar')).not.toBeNull();
            });
        });

        it('should use optionText with a function value as text identifier', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionText={choice => choice.foobar}
                                choices={[
                                    { id: 2, foobar: 'foo' },
                                    { id: 3, foobar: 'bar' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByDisplayValue('foo')).not.toBeNull();

            fireEvent.focus(
                screen.getByLabelText('resources.users.fields.role')
            );
            await waitFor(() => {
                expect(screen.queryByText('bar')).not.toBeNull();
            });
        });

        it('should not use optionText defined with a function value on the "create new item" option', async () => {
            const choices = [
                { id: 'ang', fullname: 'Angular' },
                { id: 'rea', fullname: 'React' },
            ];
            const optionText = jest.fn(choice => choice.fullname);

            const handleCreate = filter => ({
                id: 'newid',
                fullname: filter,
            });

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm mode="onBlur" onSubmit={jest.fn()}>
                            <AutocompleteInput
                                source="language"
                                resource="posts"
                                choices={choices}
                                optionText={optionText}
                                onCreate={handleCreate}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            ) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, { target: { value: 'Vue' } });
            await new Promise(resolve => setTimeout(resolve));
            expect(screen.getByText('ra.action.create_item')).not.toBeNull();
        });

        it('should use optionText with an element value', () => {
            const OptionItem = props => {
                const record = useRecordContext();
                return <div {...props} aria-label={record && record.name} />;
            };

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionText={<OptionItem />}
                                matchSuggestion={() => true}
                                inputText={record => record?.name}
                                choices={[
                                    { id: 1, name: 'bar' },
                                    { id: 2, name: 'foo' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText('resources.users.fields.role');
            fireEvent.focus(input);

            expect(screen.queryByLabelText('bar')).not.toBeNull();
        });

        it('should throw an error if no inputText was provided when the optionText returns an element', async () => {
            const mock = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});
            const SuggestionItem = props => {
                const record = useRecordContext();
                return <div {...props} aria-label={record && record.name} />;
            };

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            onSubmit={jest.fn()}
                            defaultValues={{ role: 2 }}
                        >
                            <AutocompleteInput
                                {...defaultProps}
                                optionText={() => <SuggestionItem />}
                                matchSuggestion={() => true}
                                choices={[
                                    { id: 1, name: 'bar' },
                                    { id: 2, name: 'foo' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            await screen.findByText(
                'When optionText returns a React element, you must also provide the inputText prop'
            );
            mock.mockRestore();
        });
    });

    describe('matchSuggestion', () => {
        it('should take over the default matching function when provided', async () => {
            const choices = [
                { id: 'ang', name: 'Angular' },
                { id: 'rea', name: 'React' },
            ];

            render(
                <AdminContext>
                    <ResourceContextProvider value="posts">
                        <SimpleForm mode="onBlur" onSubmit={jest.fn()}>
                            <AutocompleteInput
                                source="language"
                                resource="posts"
                                choices={choices}
                                matchSuggestion={(filter, choice) => {
                                    if (!filter) return true;
                                    if (
                                        filter === 'gugu' &&
                                        choice.name === 'Angular'
                                    ) {
                                        return true;
                                    }
                                    if (
                                        filter === 'rere' &&
                                        choice.name === 'React'
                                    ) {
                                        return true;
                                    }
                                    return false;
                                }}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            ) as HTMLInputElement;
            input.focus();
            await screen.findByText('Angular');
            await screen.findByText('React');
            fireEvent.change(input, { target: { value: 'Angular' } });
            // no option match
            await waitFor(() => {
                expect(screen.queryByText('Angular')).toBeNull();
                expect(screen.queryByText('React')).toBeNull();
            });
            fireEvent.change(input, { target: { value: 'gugu' } });
            // only Angular option matches
            await waitFor(() => {
                expect(screen.queryByText('React')).toBeNull();
            });
            screen.getByText('Angular');
            // don't forget to close the dropdown, otherwise following tests will fail
            fireEvent.click(screen.getByText('Angular'));
        });

        it('should allow matching element optionText', async () => {
            const choices = [
                { id: 'ang', name: 'Angular' },
                { id: 'rea', name: 'React' },
            ];
            const OptionText = () => {
                const record = useRecordContext();
                return <span>option:{record?.name}</span>;
            };
            render(
                <AdminContext>
                    <ResourceContextProvider value="posts">
                        <SimpleForm mode="onBlur" onSubmit={jest.fn()}>
                            <AutocompleteInput
                                source="language"
                                resource="posts"
                                choices={choices}
                                matchSuggestion={(filter, choice) => {
                                    if (!filter) return true;
                                    if (
                                        filter === 'gugu' &&
                                        choice.name === 'Angular'
                                    ) {
                                        return true;
                                    }
                                    if (
                                        filter === 'rere' &&
                                        choice.name === 'React'
                                    ) {
                                        return true;
                                    }
                                    return false;
                                }}
                                optionText={<OptionText />}
                                inputText={option => option.name}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            ) as HTMLInputElement;
            input.focus();
            await screen.findByText('option:Angular');
            await screen.findByText('option:React');
            fireEvent.change(input, { target: { value: 'Angular' } });
            // no option match
            await waitFor(() => {
                expect(screen.queryByText('option:Angular')).toBeNull();
                expect(screen.queryByText('option:React')).toBeNull();
            });
            fireEvent.change(input, { target: { value: 'gugu' } });
            // only Angular option matches
            await waitFor(() => {
                expect(screen.queryByText('option:React')).toBeNull();
            });
            screen.getByText('option:Angular');
            // don't forget to close the dropdown, otherwise following tests will fail
            fireEvent.click(screen.getByText('option:Angular'));
        });
    });

    it('should not match selection when selected choice id equals the emptyValue while changing the input', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 2, name: 'foo' },
                                { id: 3, name: 'bar' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;

        fireEvent.focus(input);

        userEvent.type(input, 'f');
        await waitFor(() => {
            expect(input.value).toEqual('f');
        });

        userEvent.type(input, '{backspace}');
        await waitFor(() => {
            expect(input.value).toEqual('');
        });
    });

    describe('translateChoice', () => {
        it('should translate the choices by default', async () => {
            render(<TranslateChoice />);
            const inputElement = (await screen.findByLabelText(
                'translateChoice default'
            )) as HTMLInputElement;
            expect(inputElement.value).toBe('Female');
        });
        it('should not translate the choices when translateChoice is false', async () => {
            render(<TranslateChoice />);
            const inputElement = (await screen.findByLabelText(
                'translateChoice false'
            )) as HTMLInputElement;
            expect(inputElement.value).toBe('option.female');
        });
        it('should not translate the choices when inside ReferenceInput by default', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const inputElement = screen.getByLabelText(
                    'inside ReferenceInput'
                ) as HTMLInputElement;
                expect(inputElement.value).toBe('option.female');
            });
        });
        it('should translate the choices when inside ReferenceInput when translateChoice is true', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const inputElement = screen.getByLabelText(
                    'inside ReferenceInput forced'
                ) as HTMLInputElement;
                expect(inputElement.value).toBe('Female');
            });
        });
    });

    it('should show the suggestions on focus', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
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
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
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
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: null }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: null }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'bar' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(input.value).toEqual('');
    });

    it('should repopulate the suggestions after the suggestions are dismissed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: null }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: null }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: null }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'bar' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(input.value).toEqual('foo');
    });

    it('should show the suggestions when the input value is null and the input is focussed and choices arrived late', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <AutocompleteInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
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
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
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
                </ResourceContextProvider>
            </AdminContext>
        );
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
        });
        expect(setFilter).toHaveBeenCalledWith('');
    });

    it('should reset filter when users selected a value', async () => {
        const setFilter = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteInput
                            {...defaultProps}
                            setFilter={setFilter}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        userEvent.type(input, 'ba');
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledWith('ba');
        });
        await waitFor(() => {
            screen.getByText('bar');
        });
        fireEvent.click(screen.getByText('bar'));
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
        });
        expect(setFilter).toHaveBeenCalledWith('');
    });

    it('should display options properly when labels are identical', () => {
        let errMessage = undefined;
        jest.spyOn(console, 'error').mockImplementation(
            message => (errMessage = message)
        );
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            getOptionLabel={option => option.name}
                            choices={[
                                { id: 1, name: 'identical' },
                                { id: 2, name: 'identical' },
                                { id: 3, name: 'identical' },
                                { id: 4, name: 'different' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'identical' } });

        expect(errMessage).toEqual(undefined);
    });

    it('should display helperText if specified', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 1 }}
                    >
                        <AutocompleteInput
                            {...defaultProps}
                            helperText="Can I help you?"
                            choices={[{ id: 1, name: 'hello' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
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
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.change(input, { target: { value: 'a' } });
        await waitFor(() => {
            expect(screen.queryAllByRole('option').length).toEqual(2);
        });
        fireEvent.blur(input);
        fireEvent.focus(input);
        await waitFor(() => {
            expect(screen.queryAllByRole('option').length).toEqual(3);
        });
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
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
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.users.fields.role');
        fireEvent.change(input, { target: { value: 'ab' } });
        await waitFor(() =>
            expect(screen.queryAllByRole('option').length).toEqual(2)
        );
    });

    it('should accept 0 as an input value', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 0, name: 'foo' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'foo' } });
        await waitFor(
            () => {
                expect(screen.queryAllByRole('option')).toHaveLength(1);
            },
            { timeout: 2000 }
        );
        fireEvent.click(screen.getByText('foo'));
        await waitFor(() => {
            expect(input.value).toEqual('foo');
        });
    });

    describe('onCreate', () => {
        it("shouldn't include an option with the create label when the input is empty", async () => {
            render(<OnCreate />);
            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: '' },
            });
            expect(screen.queryByText(/Create/)).toBeNull();
        });
        it('should include an option with the custom createLabel when the input is empty', async () => {
            render(<CreateLabel />);
            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: '' },
            });
            const customCreateLabel = screen.queryByText(
                'Start typing to create a new item'
            );
            expect(customCreateLabel).not.toBeNull();
            expect(
                (customCreateLabel as HTMLElement).getAttribute('aria-disabled')
            ).toEqual('true');
            expect(screen.queryByText(/Create/)).toBeNull();
        });
        it('should include an option with the custom createItemLabel when the input is not empty', async () => {
            render(<CreateItemLabel />);
            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: 'foo' },
            });
            await screen.findByText('Add a new author: foo');
            expect(screen.queryByText(/Create/)).toBeNull();
        });
        it('should not show the create option when a choice is selected when using a custom createLabel', async () => {
            render(<CreateLabel />);

            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            input.focus();

            // First, clear the input
            fireEvent.change(input, {
                target: { value: '' },
            });
            // We expect only the 'Start typing to create a new item' option
            await screen.findByText('Victor Hugo');
            const customCreateLabel = screen.queryByText(
                'Start typing to create a new item'
            );
            expect(customCreateLabel).not.toBeNull();
            expect(
                (customCreateLabel as HTMLElement).getAttribute('aria-disabled')
            ).toEqual('true');
            expect(screen.queryByText(/Create/)).toBeNull();

            // Then, change the input to an existing value
            fireEvent.click(screen.getByText('Leo Tolstoy'));
            fireEvent.focus(input);
            // We expect all create labels not to render
            await screen.findByText('Victor Hugo');
            expect(
                screen.queryByText('Start typing to create a new item')
            ).toBeNull();
            expect(screen.queryByText(/Create/)).toBeNull();
        });
        it('should include an option with the createItemLabel when the input not empty', async () => {
            render(<OnCreate />);
            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: 'foo' },
            });

            expect(screen.queryByText('Create')).toBeNull();
            expect(screen.queryByText('Create foo')).not.toBeNull();
        });
        it('should not include a create option when the input matches an option', async () => {
            render(<OnCreate />);
            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: 'Leo Tolstoy' },
            });
            expect(screen.queryByText(/Create/)).toBeNull();
        });
        it('should allow the creation of a new choice', async () => {
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
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            ) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: 'New Kid On The Block' },
            });
            fireEvent.click(screen.getByText('ra.action.create_item'));
            await new Promise(resolve => setTimeout(resolve));
            rerender(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(
                screen.queryByDisplayValue('New Kid On The Block')
            ).not.toBeNull();
            fireEvent.click(
                screen.getByLabelText('ra.action.clear_input_value')
            );
            fireEvent.blur(input);
            fireEvent.focus(input);
            expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
        });
        it('should allow the creation of a new choice with a promise', async () => {
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
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            ) as HTMLInputElement;
            input.focus();
            fireEvent.change(input, {
                target: { value: 'New Kid On The Block' },
            });
            fireEvent.click(screen.getByText('ra.action.create_item'));
            await new Promise(resolve => setTimeout(resolve, 100));
            rerender(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(
                screen.queryByDisplayValue('New Kid On The Block')
            ).not.toBeNull();
            fireEvent.click(
                screen.getByLabelText('ra.action.clear_input_value')
            );
            fireEvent.blur(input);
            fireEvent.focus(input);
            expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
        });
        it('should not use the createItemLabel as the value of the input', async () => {
            render(<OnCreateSlow />);
            await screen.findByText('Book War and Peace', undefined, {
                timeout: 2000,
            });
            const input = screen.getByLabelText('Author') as HTMLInputElement;
            await waitFor(
                () => {
                    expect(input.value).toBe('Leo Tolstoy');
                },
                { timeout: 2000 }
            );
            fireEvent.focus(input);
            expect(screen.getAllByRole('option')).toHaveLength(4);
            fireEvent.change(input, { target: { value: 'x' } });
            await waitFor(
                () => {
                    expect(screen.getAllByRole('option')).toHaveLength(1);
                },
                { timeout: 2000 }
            );
            fireEvent.click(screen.getByText('Create x'));
            expect(input.value).not.toBe('Create x');
            expect(input.value).toBe('x');
        }, 10000);
    });
    describe('create', () => {
        it('should allow the creation of a new choice', async () => {
            const choices = [
                { id: 'ang', name: 'Angular' },
                { id: 'rea', name: 'React' },
            ];
            const newChoice = {
                id: 'js_fatigue',
                name: 'New Kid On The Block',
            };

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
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            ) as HTMLInputElement;
            fireEvent.change(input, {
                target: { value: 'New Kid On The Block' },
            });
            fireEvent.click(screen.getByText('ra.action.create_item'));
            fireEvent.click(screen.getByText('Get the kid'));
            await new Promise(resolve => setTimeout(resolve));
            rerender(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
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
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(
                screen.queryByDisplayValue('New Kid On The Block')
            ).not.toBeNull();
            fireEvent.click(
                screen.getByLabelText('ra.action.clear_input_value')
            );
            fireEvent.blur(input);
            fireEvent.focus(input);
            expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
        });
    });

    it('should return null when no choice is selected', async () => {
        const onSuccess = jest.fn();
        render(<Basic onSuccess={onSuccess} />);
        const clearBtn = await screen.findByLabelText('Clear value');
        fireEvent.click(clearBtn);
        screen.getByText('Save').click();
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                expect.objectContaining({ author: null }),
                expect.anything(),
                expect.anything()
            );
        });
    });

    it('should include full record when calling onChange', async () => {
        const onChange = jest.fn();
        render(<OnChange onChange={onChange} />);
        await waitFor(() => {
            expect(
                (screen.getByRole('combobox') as HTMLInputElement).value
            ).toBe('Leo Tolstoy');
        });
        screen.getByRole('combobox').focus();
        fireEvent.click(await screen.findByText('Victor Hugo'));
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(2, {
                id: 2,
                name: 'Victor Hugo',
            });
        });
    });

    describe('Inside <ReferenceInput>', () => {
        it('should work inside a ReferenceInput field', async () => {
            render(<InsideReferenceInput />);
            await screen.findByDisplayValue('Leo Tolstoy');
            await waitFor(() => {
                expect(
                    (screen.getByRole('combobox') as HTMLInputElement).value
                ).toBe('Leo Tolstoy');
            });
            screen.getByRole('combobox').focus();
            fireEvent.click(screen.getByLabelText('Clear value'));
            await waitFor(() => {
                expect(screen.getByRole('listbox').children).toHaveLength(5);
            });
            fireEvent.change(screen.getByRole('combobox'), {
                target: { value: 'Vic' },
            });
            await waitFor(
                () => {
                    expect(screen.getByRole('listbox').children).toHaveLength(
                        1
                    );
                },
                { timeout: 2000 }
            );
            expect(screen.queryByText('Leo Tolstoy')).toBeNull();
        });

        it('should allow to clear the value inside a ReferenceInput field', async () => {
            render(<InsideReferenceInput />);
            await screen.findByDisplayValue('Leo Tolstoy');
            await waitFor(() => {
                expect(
                    (screen.getByRole('combobox') as HTMLInputElement).value
                ).toBe('Leo Tolstoy');
            });
            fireEvent.click(screen.getByLabelText('Clear value'));
            userEvent.tab();
            // Couldn't reproduce the infinite loop issue without this timeout
            // See https://github.com/marmelab/react-admin/issues/7482
            await new Promise(resolve => setTimeout(resolve, 2000));
            await waitFor(() => {
                expect(
                    (screen.getByRole('combobox') as HTMLInputElement).value
                ).toEqual('');
            });
            expect(screen.queryByText('Leo Tolstoy')).toBeNull();
        });

        it('should repopulate the suggestions after the suggestions are dismissed', async () => {
            render(<InsideReferenceInput />);
            const input = await screen.findByLabelText('Author');
            fireEvent.focus(input);
            await waitFor(() => {
                expect(screen.queryByText('Victor Hugo')).not.toBeNull();
            });
            fireEvent.change(input, { target: { value: 'bar' } });
            await waitFor(
                () => {
                    expect(screen.queryByText('Victor Hugo')).toBeNull();
                },
                { timeout: 2000 }
            );
            fireEvent.blur(input);
            fireEvent.focus(input);
            await waitFor(
                () => {
                    expect(screen.queryByText('Victor Hugo')).not.toBeNull();
                },
                { timeout: 2000 }
            );
        });

        it('should not change an undefined value to empty string', async () => {
            const onSuccess = jest.fn();
            render(<InsideReferenceInputDefaultValue onSuccess={onSuccess} />);
            const input = await screen.findByDisplayValue('War and Peace');
            fireEvent.change(input, { target: { value: 'War' } });
            screen.getByText('Save').click();
            await waitFor(() => {
                expect(onSuccess).toHaveBeenCalledWith(
                    expect.objectContaining({ author: undefined }),
                    expect.anything(),
                    expect.anything()
                );
            });
        });

        it('should not reset the filter when typing when getMany returns a different record shape than getList', async () => {
            render(<DifferentShapeInGetMany />);
            await screen.findByDisplayValue('Leo Tolstoy');
            const input = (await screen.findByLabelText(
                'Author'
            )) as HTMLInputElement;
            expect(input.value).toBe('Leo Tolstoy');
            fireEvent.mouseDown(input);
            fireEvent.change(input, { target: { value: 'Leo Tolstoy test' } });
            // Make sure that 'Leo Tolstoy' did not reappear
            let testFailed = false;
            try {
                await waitFor(() => {
                    expect(input.value).toBe('Leo Tolstoy');
                });
                testFailed = true;
            } catch {
                // This is expected, nothing to do
            }
            expect(testFailed).toBe(false);
            expect(input.value).toBe('Leo Tolstoy test');
        });

        it('should not use getSuggestions to do client-side filtering', async () => {
            // filtering should be done server-side only, and hence matchSuggestion should never be called
            const matchSuggestion = jest.fn().mockReturnValue(true);
            render(
                <InsideReferenceInputWithCustomizedItemRendering
                    matchSuggestion={matchSuggestion}
                />
            );
            await waitFor(
                () => {
                    expect(
                        (screen.getByRole('combobox') as HTMLInputElement).value
                    ).toBe('Leo Tolstoy - Russian');
                },
                { timeout: 4000 }
            );
            screen.getByRole('combobox').focus();
            fireEvent.click(screen.getByLabelText('Clear value'));
            await waitFor(() => {
                expect(screen.getByRole('listbox').children).toHaveLength(5);
            });
            fireEvent.change(screen.getByRole('combobox'), {
                target: { value: 'French' },
            });
            await screen.findByText('No options', undefined, {
                timeout: 10000,
            });
            expect(matchSuggestion).not.toHaveBeenCalled();
        }, 20000);

        it('should include full record when calling onChange', async () => {
            const onChange = jest.fn();
            render(<InsideReferenceInputOnChange onChange={onChange} />);
            (await screen.findAllByRole('combobox'))[0].focus();
            fireEvent.click(await screen.findByText('Victor Hugo'));
            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(2, {
                    id: 2,
                    language: 'French',
                    name: 'Victor Hugo',
                });
            });
            expect(screen.getByDisplayValue('French')).not.toBeNull();
        });
    });

    it("should allow to edit the input if it's inside a FormDataConsumer", async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        mode="onBlur"
                        resource="posts"
                        onSubmit={jest.fn()}
                        defaultValues={{ role: 2 }}
                    >
                        <FormDataConsumer>
                            {() => {
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
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText('Id', {
            selector: 'input',
        }) as HTMLInputElement;
        fireEvent.focus(input);
        userEvent.type(input, 'Hello World!');
        await screen.findByDisplayValue('Hello World!');
    });

    it('should display "No options" and not throw any error inside a ReferenceArrayInput field when referenced list is empty', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <ReferenceArrayInput
                            label="Tags"
                            reference="tags"
                            source="tags"
                        >
                            <AutocompleteArrayInput />
                        </ReferenceArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        // Give time for the (previously thrown) error to happen
        await new Promise(resolve => setTimeout(resolve, 1000));
        await waitFor(() => {
            screen.getByText('resources.posts.fields.tags');
        });
        fireEvent.click(screen.getByText('resources.posts.fields.tags'));
        await waitFor(() => {
            screen.getByText('No options');
        });
    });

    it('should allow a very large number of choices', async () => {
        render(<VeryLargeOptionsNumber />);
        await screen.findByRole('combobox');

        screen.getByRole('combobox').click();
        userEvent.type(screen.getByRole('combobox'), '1050');
        await waitFor(() => {
            screen.getByText(/Dalmatian #1050/);
        });
    });

    it('should clear the input when its blurred, having an unmatching selection and clearOnBlur prop is true', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteInput
                            {...defaultProps}
                            clearOnBlur
                            choices={[
                                { id: 1, name: 'ab' },
                                { id: 2, name: 'abc' },
                                { id: 3, name: '123' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'no match' } });
        fireEvent.blur(input);
        await waitFor(() => {
            expect(input.value).toEqual('');
        });
    });

    it('should clear the input mutiple tiles with on create set', async () => {
        render(<OnCreate />);

        const input = (await screen.findByLabelText(
            'Author'
        )) as HTMLInputElement;
        userEvent.type(input, 'New choice');
        const clear = screen.getByLabelText('Clear value');
        fireEvent.click(clear);
        expect(input.value).toEqual('');
        userEvent.type(input, 'New choice');
        fireEvent.click(clear);
        expect(input.value).toEqual('');
    });

    it('should handle nullish values', async () => {
        render(<NullishValuesSupport />);

        const checkInputValue = async (label: string, expected: any) => {
            const input = (await screen.findByLabelText(
                label
            )) as HTMLInputElement;
            await waitFor(() => {
                expect(input.value).toStrictEqual(expected);
            });
        };

        await checkInputValue('prefers_empty-string', '');
        await checkInputValue('prefers_null', '');
        await checkInputValue('prefers_undefined', '');
        await checkInputValue('prefers_zero-string', '0');
        await checkInputValue('prefers_zero-number', '0');
        await checkInputValue('prefers_valid-value', '1');
    });

    it('should call the onInputChange callback', async () => {
        const onInputChange = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteInput
                            {...defaultProps}
                            onInputChange={onInputChange}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.users.fields.role'
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'newValue' } });
        await waitFor(() => expect(onInputChange).toHaveBeenCalled());
    });

    describe('InputProps', () => {
        it('should pass InputProps to the input', async () => {
            render(<WithInputProps />);
            const input = await screen.findByRole('combobox');
            screen.getByTestId('AttributionIcon');
            screen.getByTestId('ExpandCircleDownIcon');
            fireEvent.click(input);
            screen.getByText('Victor Hugo');
        });
    });
});
