import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    required,
    ResourceContextProvider,
    testDataProvider,
    useRecordContext,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { SelectInput } from './SelectInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import {
    StringChoices,
    EmptyText,
    InsideReferenceInput,
    InsideReferenceInputDefaultValue,
    Sort,
    TranslateChoice,
    FetchChoices,
    CreateLabel,
} from './SelectInput.stories';

describe('<SelectInput />', () => {
    const defaultProps = {
        source: 'language',
        choices: [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ],
    };

    it('should use the input parameter value as the initial input value', async () => {
        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{ language: 'ang' }}
                        onSubmit={jest.fn()}
                    >
                        <SelectInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = container.querySelector('input');
        expect(input?.value).toEqual('ang');
    });

    describe('choices', () => {
        it('should render choices as mui MenuItem components', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput {...defaultProps} />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );
            expect(screen.queryAllByRole('option').length).toEqual(3);

            expect(
                screen
                    .getByTitle('ra.action.clear_input_value')
                    .getAttribute('data-value')
            ).toEqual('');

            expect(
                screen.getByText('Angular').getAttribute('data-value')
            ).toEqual('ang');

            expect(
                screen.getByText('React').getAttribute('data-value')
            ).toEqual('rea');
        });

        it('should render disabled choices marked so', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                choices={[
                                    { id: 'ang', name: 'Angular' },
                                    {
                                        id: 'rea',
                                        name: 'React',
                                        disabled: true,
                                    },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByText('Angular').getAttribute('aria-disabled')
            ).toBeNull();
            expect(
                screen.getByText('React').getAttribute('aria-disabled')
            ).toEqual('true');
        });

        it('should include an empty option by default', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput {...defaultProps} />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );
            expect(screen.queryAllByRole('option')).toHaveLength(3);
        });

        it('should not include an empty option if the field is required', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                validate={required()}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language *')
            );
            expect(screen.queryAllByRole('option')).toHaveLength(2);
        });

        it('should return the choices in the order in which they were defined', () => {
            render(<Sort />);
            fireEvent.mouseDown(screen.getByLabelText('Status'));
            const options = screen.queryAllByRole('option');
            expect(options.length).toEqual(6);
            expect(options[1].textContent).toEqual('Created');
        });

        it('should accept strings as choices', () => {
            render(<StringChoices />);
            fireEvent.mouseDown(screen.getByLabelText('Gender'));
            const options = screen.queryAllByRole('option');
            expect(options.length).toEqual(3);
            expect(options[1].textContent).toEqual('Male');
        });
    });

    describe('emptyText', () => {
        it('should allow to override the empty menu option text by passing a string', () => {
            const emptyText = 'Default';

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                emptyText={emptyText}
                                {...defaultProps}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(screen.queryAllByRole('option').length).toEqual(3);

            expect(screen.getByText('Default')).not.toBeNull();
        });

        it('should allow to override the empty menu option text by passing a React element', () => {
            const emptyText = (
                <div>
                    <em>Empty choice</em>
                </div>
            );

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                emptyText={emptyText}
                                {...defaultProps}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(screen.queryAllByRole('option').length).toEqual(3);

            expect(screen.getByText('Empty choice')).not.toBeNull();
        });
    });

    describe('optionValue', () => {
        it('should use optionValue as value identifier', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                optionValue="foobar"
                                choices={[
                                    { foobar: 'ang', name: 'Angular' },
                                    { foobar: 'rea', name: 'React' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByText('Angular').getAttribute('data-value')
            ).toEqual('ang');
        });

        it('should use optionValue including "." as value identifier', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                optionValue="foobar.id"
                                choices={[
                                    { foobar: { id: 'ang' }, name: 'Angular' },
                                    { foobar: { id: 'rea' }, name: 'React' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByText('Angular').getAttribute('data-value')
            ).toEqual('ang');
        });
    });

    describe('optionText', () => {
        it('should use optionText with a string value as text identifier', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                optionText="foobar"
                                choices={[
                                    { id: 'ang', foobar: 'Angular' },
                                    { id: 'rea', foobar: 'React' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByText('Angular').getAttribute('data-value')
            ).toEqual('ang');
        });

        it('should use optionText with a string value including "." as text identifier', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                optionText="foobar.name"
                                choices={[
                                    { id: 'ang', foobar: { name: 'Angular' } },
                                    { id: 'rea', foobar: { name: 'React' } },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByText('Angular').getAttribute('data-value')
            ).toEqual('ang');
        });

        it('should use optionText with a function value as text identifier', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                optionText={choice => choice.foobar}
                                choices={[
                                    { id: 'ang', foobar: 'Angular' },
                                    { id: 'rea', foobar: 'React' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByText('Angular').getAttribute('data-value')
            ).toEqual('ang');
        });

        it('should use optionText with an element value as text identifier', () => {
            const Foobar = () => {
                const record = useRecordContext();
                return (
                    <span data-value={record?.id} aria-label={record?.foobar} />
                );
            };
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                optionText={<Foobar />}
                                choices={[
                                    { id: 'ang', foobar: 'Angular' },
                                    { id: 'rea', foobar: 'React' },
                                ]}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            fireEvent.mouseDown(
                screen.getByLabelText('resources.posts.fields.language')
            );

            expect(
                screen.getByLabelText('Angular').getAttribute('data-value')
            ).toEqual('ang');
        });
    });

    describe('translateChoice', () => {
        it('should translate the choices by default', async () => {
            render(<TranslateChoice />);
            const selectedElement = await screen.findByLabelText(
                'translateChoice default'
            );
            expect(selectedElement.textContent).toBe('Female');
        });
        it('should not translate the choices when translateChoice is false', async () => {
            render(<TranslateChoice />);
            const selectedElement = await screen.findByLabelText(
                'translateChoice false'
            );
            expect(selectedElement.textContent).toBe('option.female');
        });
        it('should not translate the choices when inside ReferenceInput by default', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const selectedElement = screen.getByLabelText(
                    'inside ReferenceInput'
                );
                expect(selectedElement.textContent).toBe('option.female');
            });
        });
        it('should translate the choices when inside ReferenceInput when translateChoice is true', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const selectedElement = screen.getByLabelText(
                    'inside ReferenceInput forced'
                );
                expect(selectedElement.textContent).toBe('Female');
            });
        });
    });

    it('should display helperText if prop is present', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{ language: 'ang' }}
                        onSubmit={jest.fn()}
                    >
                        <SelectInput
                            {...defaultProps}
                            helperText="Can I help you?"
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const helperText = screen.getByText('Can I help you?');
        expect(helperText).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            defaultValues={{ language: 'ang' }}
                            onSubmit={jest.fn()}
                        >
                            <SelectInput
                                {...defaultProps}
                                helperText="helperText"
                                validate={() => 'error'}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            screen.getByText('helperText');
            expect(screen.queryAllByText('error')).toHaveLength(0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm
                            defaultValues={{ language: 'ang' }}
                            mode="onBlur"
                            onSubmit={jest.fn()}
                        >
                            <SelectInput
                                {...defaultProps}
                                helperText="helperText"
                                validate={() => undefined}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            );
            input.focus();
            input.blur();

            screen.getByText('helperText');
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm mode="onChange" onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                helperText="helperText"
                                emptyText="Empty"
                                validate={() => 'error'}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const select = screen.getByLabelText(
                'resources.posts.fields.language'
            );
            fireEvent.mouseDown(select);

            const optionAngular = screen.getByText('Angular');
            fireEvent.click(optionAngular);
            select.blur();

            await screen.findByText('error');
            expect(screen.queryAllByText('helperText')).toHaveLength(0);
        });
    });

    describe('loading', () => {
        it('should not render a LinearProgress if isPending is true and a second has not passed yet', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput {...defaultProps} isPending />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            expect(screen.queryByRole('progressbar')).toBeNull();
        });

        it('should render a LinearProgress if isPending is true and a second has passed', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput {...defaultProps} isPending />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            await new Promise(resolve => setTimeout(resolve, 1001));

            await screen.findByRole('progressbar');
        });

        it('should not render a LinearProgress if isPending is false', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput {...defaultProps} />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            expect(screen.queryByRole('progressbar')).toBeNull();
        });
    });

    describe('onCreate', () => {
        it('should support creation of a new choice through the onCreate event', async () => {
            jest.spyOn(console, 'warn').mockImplementation(() => {});
            const choices = [...defaultProps.choices];
            const newChoice = {
                id: 'js_fatigue',
                name: 'New Kid On The Block',
            };

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                choices={choices}
                                onCreate={() => {
                                    choices.push(newChoice);
                                    return newChoice;
                                }}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            );
            fireEvent.mouseDown(input);

            fireEvent.click(screen.getByText('ra.action.create'));
            await waitFor(() => {
                expect(screen.queryByText(newChoice.name)).not.toBeNull();
            });
        });

        it('should support creation of a new choice through the onCreate event with a promise', async () => {
            const choices = [...defaultProps.choices];
            const newChoice = {
                id: 'js_fatigue',
                name: 'New Kid On The Block',
            };

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                choices={choices}
                                defaultValue="ang"
                                onCreate={() => {
                                    return new Promise(resolve => {
                                        setTimeout(() => {
                                            choices.push(newChoice);
                                            resolve(newChoice);
                                        }, 50);
                                    });
                                }}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            );
            fireEvent.mouseDown(input);

            fireEvent.click(screen.getByText('ra.action.create'));

            await waitFor(() => {
                expect(screen.queryByText(newChoice.name)).not.toBeNull();
            });
        });

        it('should support creation of a new choice with nested optionText', async () => {
            const choices = [
                { id: 'programming', name: { en: 'Programming' } },
                { id: 'lifestyle', name: { en: 'Lifestyle' } },
                { id: 'photography', name: { en: 'Photography' } },
            ];
            const newChoice = {
                id: 'js_fatigue',
                name: { en: 'New Kid On The Block' },
            };

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                choices={choices}
                                onCreate={() => {
                                    choices.push(newChoice);
                                    return newChoice;
                                }}
                                optionText="name.en"
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'resources.posts.fields.language'
            );
            fireEvent.mouseDown(input);

            fireEvent.click(screen.getByText('ra.action.create'));
            await waitFor(() => {
                expect(screen.queryByText(newChoice.name.en)).not.toBeNull();
            });
        });

        it('should support using a custom createLabel', async () => {
            const promptSpy = jest.spyOn(window, 'prompt');
            promptSpy.mockImplementation(jest.fn(() => 'New Category'));
            render(<CreateLabel />);
            const input = (await screen.findByLabelText(
                'Category'
            )) as HTMLInputElement;
            fireEvent.mouseDown(input);
            // Expect the custom create label to be displayed
            fireEvent.click(await screen.findByText('Create a new category'));
            // Expect a prompt to have opened
            await waitFor(() => {
                expect(promptSpy).toHaveBeenCalled();
            });
            promptSpy.mockRestore();
        });
    });

    it('should support creation of a new choice through the create element', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            create={<Create />}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        fireEvent.click(screen.getByText('Get the kid'));

        await waitFor(() => {
            expect(screen.queryByText(newChoice.name)).not.toBeNull();
        });
    });

    it('should receive an event object on change', async () => {
        const choices = [...defaultProps.choices];
        const onChange = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            defaultValue="ang"
                            inputProps={{ 'data-testid': 'content-input' }}
                            onChange={onChange}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByTestId('content-input');
        fireEvent.change(input, {
            target: { value: 'rea' },
        });

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    bubbles: true,
                    cancelable: false,
                    currentTarget: null,
                    eventPhase: 3,
                    isTrusted: false,
                    type: 'change',
                })
            );
        });
    });

    it('should receive a value on change when creating a new choice', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };
        const onChange = jest.fn();

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            create={<Create />}
                            onChange={onChange}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        fireEvent.click(screen.getByText('Get the kid'));

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith('js_fatigue');
        });
    });

    describe('fetching choices', () => {
        it('should display the choices once fetched', async () => {
            render(<FetchChoices />);
            await screen.findByText('Leo Tolstoy');
        });
    });

    describe('inside ReferenceInput', () => {
        it('should use the recordRepresentation as optionText', async () => {
            render(<InsideReferenceInput />);
            await screen.findByText('Leo Tolstoy');
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
    });

    it('should return null when empty', async () => {
        const onSuccess = jest.fn();
        render(<EmptyText onSuccess={onSuccess} />);
        const input = await screen.findByLabelText('Gender');
        fireEvent.mouseDown(input);
        fireEvent.click(screen.getByText('Male'));
        fireEvent.click(screen.getByText('None'));
        screen.getByText('Save').click();
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                expect.objectContaining({ gender: null }),
                expect.anything(),
                undefined
            );
        });
    });
});
