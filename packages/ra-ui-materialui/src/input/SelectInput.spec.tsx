import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { TestTranslationProvider } from 'ra-core';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SelectInput } from './SelectInput';
import { required } from 'ra-core';
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

    it('should use the input parameter value as the initial input value', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Form
                    initialValues={{ language: 'ang' }}
                    onSubmit={jest.fn()}
                    render={() => <SelectInput {...defaultProps} />}
                />
            </ThemeProvider>
        );
        const input = container.querySelector('input');
        expect(input.value).toEqual('ang');
    });

    it('should render choices as mui MenuItem components', async () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => <SelectInput {...defaultProps} />}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const options = queryAllByRole('option');
        expect(options.length).toEqual(2);

        const option1 = getByText('Angular');
        expect(option1.getAttribute('data-value')).toEqual('ang');

        const option2 = getByText('React');
        expect(option2.getAttribute('data-value')).toEqual('rea');
    });

    it('should render disable choices marked so', () => {
        const { getByRole, getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            choices={[
                                { id: 'ang', name: 'Angular' },
                                { id: 'rea', name: 'React', disabled: true },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const option1 = getByText('Angular');
        expect(option1.getAttribute('aria-disabled')).toBeNull();

        const option2 = getByText('React');
        expect(option2.getAttribute('aria-disabled')).toEqual('true');
    });

    it('should add an empty menu when allowEmpty is true', () => {
        const { getByRole, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => <SelectInput {...defaultProps} allowEmpty />}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const options = queryAllByRole('option');
        expect(options.length).toEqual(3);
        expect(options[0].getAttribute('data-value')).toEqual('');
    });

    it('should add an empty menu with custom value when allowEmpty is true', () => {
        const emptyValue = 'test';

        const { getByRole, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            allowEmpty
                            emptyValue={emptyValue}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const options = queryAllByRole('option');
        expect(options.length).toEqual(3);
        expect(options[0].getAttribute('data-value')).toEqual(emptyValue);
    });

    it('should add an empty menu with proper text when emptyText is a string', () => {
        const emptyText = 'Default';

        const { getByRole, getByText, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            allowEmpty
                            emptyText={emptyText}
                            {...defaultProps}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const emptyOption = getByRole('button');
        fireEvent.mouseDown(emptyOption);

        const options = queryAllByRole('option');
        expect(options.length).toEqual(3);

        expect(getByText('Default')).not.toBeNull();
    });

    it('should add an empty menu with proper text when emptyText is a React element', () => {
        const emptyText = (
            <div>
                <em>Empty choice</em>
            </div>
        );

        const { getByRole, getByText, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            allowEmpty
                            emptyText={emptyText}
                            {...defaultProps}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const emptyOption = getByRole('button');
        fireEvent.mouseDown(emptyOption);

        const options = queryAllByRole('option');
        expect(options.length).toEqual(3);

        expect(getByText('Empty choice')).not.toBeNull();
    });

    it('should not add a falsy (null or false) element when allowEmpty is false', () => {
        const { getByRole, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => <SelectInput {...defaultProps} />}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const options = queryAllByRole('option');
        expect(options.length).toEqual(2);
    });

    it('should use optionValue as value identifier', () => {
        const { getByRole, getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            optionValue="foobar"
                            choices={[
                                { foobar: 'ang', name: 'Angular' },
                                { foobar: 'rea', name: 'React' },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByRole, getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            optionValue="foobar.id"
                            choices={[
                                { foobar: { id: 'ang' }, name: 'Angular' },
                                { foobar: { id: 'rea' }, name: 'React' },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByRole, getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            optionText="foobar"
                            choices={[
                                { id: 'ang', foobar: 'Angular' },
                                { id: 'rea', foobar: 'React' },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByRole, getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            optionText="foobar.name"
                            choices={[
                                { id: 'ang', foobar: { name: 'Angular' } },
                                { id: 'rea', foobar: { name: 'React' } },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByRole, getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            optionText={choice => choice.foobar}
                            choices={[
                                { id: 'ang', foobar: 'Angular' },
                                { id: 'rea', foobar: 'React' },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }: { record?: any }) => (
            <span data-value={record.id} aria-label={record.foobar} />
        );

        const { getByRole, getByLabelText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            optionText={<Foobar />}
                            choices={[
                                { id: 'ang', foobar: 'Angular' },
                                { id: 'rea', foobar: 'React' },
                            ]}
                        />
                    )}
                />
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByLabelText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should translate the choices by default', () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => <SelectInput {...defaultProps} />}
                    />
                </TestTranslationProvider>
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const options = queryAllByRole('option');
        expect(options.length).toEqual(2);

        const option1 = getByText('**Angular**');
        expect(option1.getAttribute('data-value')).toEqual('ang');

        const option2 = getByText('**React**');
        expect(option2.getAttribute('data-value')).toEqual('rea');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <ThemeProvider theme={theme}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <SelectInput
                                {...defaultProps}
                                translateChoice={false}
                            />
                        )}
                    />
                </TestTranslationProvider>
            </ThemeProvider>
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const options = queryAllByRole('option');
        expect(options.length).toEqual(2);

        const option1 = getByText('Angular');
        expect(option1.getAttribute('data-value')).toEqual('ang');

        const option2 = getByText('React');
        expect(option2.getAttribute('data-value')).toEqual('rea');
    });

    it('should display helperText if prop is present', () => {
        const { getByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            helperText="Can I help you?"
                        />
                    )}
                />
            </ThemeProvider>
        );
        const helperText = getByText('Can I help you?');
        expect(helperText).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryAllByText } = render(
                <ThemeProvider theme={theme}>
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <SelectInput
                                {...defaultProps}
                                validate={required()}
                            />
                        )}
                    />
                </ThemeProvider>
            );
            const error = queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { getByLabelText, queryAllByText } = render(
                <ThemeProvider theme={theme}>
                    <Form
                        validateOnBlur
                        initialValues={{ language: 'ang' }}
                        onSubmit={jest.fn()}
                        render={() => (
                            <SelectInput
                                {...defaultProps}
                                validate={required()}
                            />
                        )}
                    />
                </ThemeProvider>
            );
            const input = getByLabelText('resources.posts.fields.language *');
            input.focus();
            input.blur();

            const error = queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, getByRole, getByText } = render(
                <ThemeProvider theme={theme}>
                    <Form
                        validateOnBlur
                        onSubmit={jest.fn()}
                        render={() => (
                            <SelectInput
                                {...defaultProps}
                                allowEmpty
                                emptyText="Empty"
                                validate={required()}
                            />
                        )}
                    />
                </ThemeProvider>
            );
            const input = getByLabelText('resources.posts.fields.language *');
            input.focus();
            const select = getByRole('button');
            fireEvent.mouseDown(select);

            const optionAngular = getByText('Angular');
            fireEvent.click(optionAngular);
            input.blur();
            select.blur();

            input.focus();
            const optionEmpty = getByText('Empty');
            fireEvent.click(optionEmpty);
            input.blur();
            select.blur();

            const error = getByText('ra.validation.required');
            expect(error).not.toBeNull();
        });
    });

    it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
        const { queryByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...{
                                ...defaultProps,
                                loaded: true,
                                loading: true,
                            }}
                        />
                    )}
                />
            </ThemeProvider>
        );

        expect(queryByRole('progressbar')).toBeNull();
    });

    it('should render a LinearProgress if loading is true and a second has passed', async () => {
        const { queryByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...{
                                ...defaultProps,
                                loaded: true,
                                loading: true,
                            }}
                        />
                    )}
                />
            </ThemeProvider>
        );

        await new Promise(resolve => setTimeout(resolve, 1001));

        expect(queryByRole('progressbar')).not.toBeNull();
    });

    it('should not render a LinearProgress if loading is false', () => {
        const { queryByRole } = render(
            <ThemeProvider theme={theme}>
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => <SelectInput {...defaultProps} />}
                />
            </ThemeProvider>
        );

        expect(queryByRole('progressbar')).toBeNull();
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const { getByLabelText, getByRole, getByText, queryByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            onCreate={() => {
                                choices.push(newChoice);
                                return newChoice;
                            }}
                        />
                    )}
                />
            </ThemeProvider>
        );

        const input = getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        await new Promise(resolve => setImmediate(resolve));
        input.blur();

        expect(
            // The selector ensure we don't get the options from the menu but the select value
            queryByText(newChoice.name, { selector: '[role=button]' })
        ).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const { getByLabelText, getByRole, getByText, queryByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            onCreate={() => {
                                return new Promise(resolve => {
                                    setTimeout(() => {
                                        choices.push(newChoice);
                                        resolve(newChoice);
                                    }, 200);
                                });
                            }}
                        />
                    )}
                />
            </ThemeProvider>
        );

        const input = getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        await new Promise(resolve => setImmediate(resolve));
        input.blur();

        await waitFor(() => {
            expect(
                // The selector ensure we don't get the options from the menu but the select value
                queryByText(newChoice.name, { selector: '[role=button]' })
            ).not.toBeNull();
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

        const { getByLabelText, getByRole, getByText, queryByText } = render(
            <ThemeProvider theme={theme}>
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput
                            {...defaultProps}
                            choices={choices}
                            create={<Create />}
                        />
                    )}
                />
            </ThemeProvider>
        );

        const input = getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        fireEvent.click(getByText('Get the kid'));
        input.blur();

        expect(
            // The selector ensure we don't get the options from the menu but the select value
            queryByText(newChoice.name, { selector: '[role=button]' })
        ).not.toBeNull();
    });
});
