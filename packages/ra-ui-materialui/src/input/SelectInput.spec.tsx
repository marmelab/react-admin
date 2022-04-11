import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    required,
    testDataProvider,
    TestTranslationProvider,
    useRecordContext,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { SelectInput } from './SelectInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

describe('<SelectInput />', () => {
    const defaultProps = {
        source: 'language',
        resource: 'posts',
        choices: [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ],
    };

    it('should use the input parameter value as the initial input value', async () => {
        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ language: 'ang' }}
                    onSubmit={jest.fn()}
                >
                    <SelectInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        const input = container.querySelector('input');
        expect(input.value).toEqual('ang');
    });

    it('should render choices as mui MenuItem components', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput {...defaultProps} />
                </SimpleForm>
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

        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );

        expect(screen.getByText('React').getAttribute('data-value')).toEqual(
            'rea'
        );
    });

    it('should render disable choices marked so', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput
                        {...defaultProps}
                        choices={[
                            { id: 'ang', name: 'Angular' },
                            { id: 'rea', name: 'React', disabled: true },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(
            screen.getByText('Angular').getAttribute('aria-disabled')
        ).toBeNull();
        expect(screen.getByText('React').getAttribute('aria-disabled')).toEqual(
            'true'
        );
    });

    it('should allow to override the empty menu option text by passing a string', () => {
        const emptyText = 'Default';

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput emptyText={emptyText} {...defaultProps} />
                </SimpleForm>
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
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput emptyText={emptyText} {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(screen.queryAllByRole('option').length).toEqual(3);

        expect(screen.getByText('Empty choice')).not.toBeNull();
    });

    it('should use optionValue as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );
    });

    it('should use optionValue including "." as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = () => {
            const record = useRecordContext();
            return <span data-value={record.id} aria-label={record.foobar} />;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        expect(
            screen.getByLabelText('Angular').getAttribute('data-value')
        ).toEqual('ang');
    });

    it('should translate the choices by default', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('**resources.posts.fields.language**')
        );

        expect(screen.queryAllByRole('option').length).toEqual(3);
        expect(
            screen.getByText('**Angular**').getAttribute('data-value')
        ).toEqual('ang');
        expect(
            screen.getByText('**React**').getAttribute('data-value')
        ).toEqual('rea');
    });

    it('should not translate the choices if translateChoice is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            translateChoice={false}
                        />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('**resources.posts.fields.language**')
        );

        expect(screen.queryAllByRole('option').length).toEqual(3);
        expect(screen.getByText('Angular').getAttribute('data-value')).toEqual(
            'ang'
        );
        expect(screen.getByText('React').getAttribute('data-value')).toEqual(
            'rea'
        );
    });

    it('should display helperText if prop is present', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ language: 'ang' }}
                    onSubmit={jest.fn()}
                >
                    <SelectInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                </SimpleForm>
            </AdminContext>
        );
        const helperText = screen.getByText('Can I help you?');
        expect(helperText).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ language: 'ang' }}
                        onSubmit={jest.fn()}
                    >
                        <SelectInput {...defaultProps} validate={required()} />
                    </SimpleForm>
                </AdminContext>
            );
            const error = screen.queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ language: 'ang' }}
                        mode="onBlur"
                        onSubmit={jest.fn()}
                    >
                        <SelectInput {...defaultProps} validate={required()} />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText(
                'resources.posts.fields.language *'
            );
            input.focus();
            input.blur();

            const error = screen.queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm mode="onChange" onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            emptyText="Empty"
                            validate={required()}
                        />
                    </SimpleForm>
                </AdminContext>
            );

            const select = screen.getByLabelText(
                'resources.posts.fields.language *'
            );
            fireEvent.mouseDown(select);

            const optionAngular = screen.getByText('Angular');
            fireEvent.click(optionAngular);

            const optionEmpty = screen.getByText('Empty');
            fireEvent.click(optionEmpty);

            await waitFor(() => {
                expect(screen.queryByText('ra.validation.required'));
            });
        });
    });

    it('should not render a LinearProgress if isLoading is true and a second has not passed yet', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput {...defaultProps} isLoading />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should render a LinearProgress if isLoading is true and a second has passed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput {...defaultProps} isLoading />
                </SimpleForm>
            </AdminContext>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));

        expect(screen.queryByRole('progressbar')).not.toBeNull();
    });

    it('should not render a LinearProgress if isLoading is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await waitFor(() => {
            expect(screen.queryByText(newChoice.name)).not.toBeNull();
        });
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <AdminContext dataProvider={testDataProvider()}>
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
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
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
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await waitFor(() => {
            expect(screen.queryByText(newChoice.name.en)).not.toBeNull();
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
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput
                        {...defaultProps}
                        choices={choices}
                        create={<Create />}
                    />
                </SimpleForm>
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

    it('should recive an event object on change', async () => {
        const choices = [...defaultProps.choices];
        const onChange = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <SelectInput
                        {...defaultProps}
                        choices={choices}
                        defaultValue="ang"
                        inputProps={{ 'data-testid': 'content-input' }}
                        onChange={onChange}
                    />
                </SimpleForm>
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

    it('should recive a value on change when creating a new choice', async () => {
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
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectInput
                        {...defaultProps}
                        choices={choices}
                        create={<Create />}
                        onChange={onChange}
                    />
                </SimpleForm>
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
});
