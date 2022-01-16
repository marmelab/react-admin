import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    CoreAdminContext,
    required,
    testDataProvider,
    TestTranslationProvider,
} from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SimpleForm } from '../form';
import { SelectInput } from './SelectInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

const theme = createTheme({});

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
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ language: 'ang' }}
                        onSubmit={jest.fn()}
                    >
                        <SelectInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        const input = container.querySelector('input');
        expect(input.value).toEqual('ang');
    });

    it('should render choices as mui MenuItem components', async () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );
        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(2);

        const option1 = screen.getByText('Angular');
        expect(option1.getAttribute('data-value')).toEqual('ang');

        const option2 = screen.getByText('React');
        expect(option2.getAttribute('data-value')).toEqual('rea');
    });

    it('should render disable choices marked so', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            choices={[
                                { id: 'ang', name: 'Angular' },
                                { id: 'rea', name: 'React', disabled: true },
                            ]}
                        />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );
        const option1 = screen.getByText('Angular');
        expect(option1.getAttribute('aria-disabled')).toBeNull();

        const option2 = screen.getByText('React');
        expect(option2.getAttribute('aria-disabled')).toEqual('true');
    });

    it('should add an empty menu when allowEmpty is true', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} allowEmpty />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(3);
        expect(options[0].getAttribute('data-value')).toEqual('');
    });

    it('should add an empty menu with custom value when allowEmpty is true', () => {
        const emptyValue = 'test';

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            allowEmpty
                            emptyValue={emptyValue}
                        />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(3);
        expect(options[0].getAttribute('data-value')).toEqual(emptyValue);
    });

    it('should add an empty menu with proper text when emptyText is a string', () => {
        const emptyText = 'Default';

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            allowEmpty
                            emptyText={emptyText}
                            {...defaultProps}
                        />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(3);

        expect(screen.getByText('Default')).not.toBeNull();
    });

    it('should add an empty menu with proper text when emptyText is a React element', () => {
        const emptyText = (
            <div>
                <em>Empty choice</em>
            </div>
        );

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            allowEmpty
                            emptyText={emptyText}
                            {...defaultProps}
                        />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(3);

        expect(screen.getByText('Empty choice')).not.toBeNull();
    });

    it('should not add a falsy (null or false) element when allowEmpty is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );
        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(2);
    });

    it('should use optionValue as value identifier', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const option = screen.getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionValue including "." as value identifier', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const option = screen.getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const option = screen.getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const option = screen.getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const option = screen.getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }: { record?: any }) => (
            <span data-value={record.id} aria-label={record.foobar} />
        );

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.language')
        );

        const option = screen.getByLabelText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should translate the choices by default', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <TestTranslationProvider translate={x => `**${x}**`}>
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput {...defaultProps} />
                        </SimpleForm>
                    </TestTranslationProvider>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('**resources.posts.fields.language**')
        );
        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(2);

        const option1 = screen.getByText('**Angular**');
        expect(option1.getAttribute('data-value')).toEqual('ang');

        const option2 = screen.getByText('**React**');
        expect(option2.getAttribute('data-value')).toEqual('rea');
    });

    it('should not translate the choices if translateChoice is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <TestTranslationProvider translate={x => `**${x}**`}>
                        <SimpleForm onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                translateChoice={false}
                            />
                        </SimpleForm>
                    </TestTranslationProvider>
                </CoreAdminContext>
            </ThemeProvider>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('**resources.posts.fields.language**')
        );
        const options = screen.queryAllByRole('option');
        expect(options.length).toEqual(2);

        const option1 = screen.getByText('Angular');
        expect(option1.getAttribute('data-value')).toEqual('ang');

        const option2 = screen.getByText('React');
        expect(option2.getAttribute('data-value')).toEqual('rea');
    });

    it('should display helperText if prop is present', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm
                        defaultValues={{ language: 'ang' }}
                        onSubmit={jest.fn()}
                    >
                        <SelectInput
                            {...defaultProps}
                            helperText="Can I help you?"
                        />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );
        const helperText = screen.getByText('Can I help you?');
        expect(helperText).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <SimpleForm
                            defaultValues={{ language: 'ang' }}
                            onSubmit={jest.fn()}
                        >
                            <SelectInput
                                {...defaultProps}
                                validate={required()}
                            />
                        </SimpleForm>
                    </CoreAdminContext>
                </ThemeProvider>
            );
            const error = screen.queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            render(
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <SimpleForm
                            defaultValues={{ language: 'ang' }}
                            mode="onBlur"
                            onSubmit={jest.fn()}
                        >
                            <SelectInput
                                {...defaultProps}
                                validate={required()}
                            />
                        </SimpleForm>
                    </CoreAdminContext>
                </ThemeProvider>
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
                <ThemeProvider theme={theme}>
                    <CoreAdminContext dataProvider={testDataProvider()}>
                        <SimpleForm mode="onChange" onSubmit={jest.fn()}>
                            <SelectInput
                                {...defaultProps}
                                allowEmpty
                                emptyText="Empty"
                                validate={required()}
                            />
                        </SimpleForm>
                    </CoreAdminContext>
                </ThemeProvider>
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
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} isLoading />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should render a LinearProgress if isLoading is true and a second has passed', async () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} isLoading />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));

        expect(screen.queryByRole('progressbar')).not.toBeNull();
    });

    it('should not render a LinearProgress if isLoading is false', () => {
        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput {...defaultProps} />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await waitFor(() => {
            expect(screen.queryByText(newChoice.name)).not.toBeNull();
        });
    });

    // FIXME
    it.skip('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
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
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve, 100));
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
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
                </CoreAdminContext>
            </ThemeProvider>
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
            <ThemeProvider theme={theme}>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            create={<Create />}
                        />
                    </SimpleForm>
                </CoreAdminContext>
            </ThemeProvider>
        );

        const input = screen.getByLabelText('resources.posts.fields.language');
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        fireEvent.click(screen.getByText('Get the kid'));

        await waitFor(() => {
            expect(screen.queryByText(newChoice.name)).not.toBeNull();
        });
    });
});
