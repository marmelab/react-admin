import * as React from 'react';
import expect from 'expect';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { TestTranslationProvider } from 'ra-core';

import SelectArrayInput from './SelectArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

describe('<SelectArrayInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'categories',
        choices: [
            { id: 'programming', name: 'Programming' },
            { id: 'lifestyle', name: 'Lifestyle' },
            { id: 'photography', name: 'Photography' },
        ],
    };

    it('should use a mui Select', () => {
        const { queryByTestId } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <SelectArrayInput {...defaultProps} />}
            />
        );
        expect(queryByTestId('selectArray')).toBeDefined();
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByDisplayValue } = render(
            <Form
                initialValues={{ categories: ['programming', 'lifestyle'] }}
                onSubmit={jest.fn()}
                render={() => <SelectArrayInput {...defaultProps} />}
            />
        );
        expect(getByDisplayValue('programming,lifestyle')).not.toBeNull();
    });

    it('should reveal choices on click', () => {
        const { getByRole, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <SelectArrayInput {...defaultProps} />}
            />
        );
        expect(queryByText('Programming')).toBeNull();
        expect(queryByText('Lifestyle')).toBeNull();
        expect(queryByText('Photography')).toBeNull();
        fireEvent.mouseDown(getByRole('button'));
        expect(queryByText('Programming')).not.toBeNull();
        expect(queryByText('Lifestyle')).not.toBeNull();
        expect(queryByText('Photography')).not.toBeNull();
    });

    it('should use optionValue as value identifier', () => {
        const { getByRole, getByText, getByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[
                            { foobar: 'programming', name: 'Programming' },
                        ]}
                    />
                )}
            />
        );
        fireEvent.mouseDown(getByRole('button'));
        fireEvent.click(getByText('Programming'));
        expect(getByDisplayValue('programming')).not.toBeNull();
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByRole, getByText, getByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[
                            {
                                foobar: { id: 'programming' },
                                name: 'Programming',
                            },
                        ]}
                    />
                )}
            />
        );
        fireEvent.mouseDown(getByRole('button'));
        fireEvent.click(getByText('Programming'));
        expect(getByDisplayValue('programming')).not.toBeNull();
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByRole, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[{ id: 'programming', foobar: 'Programming' }]}
                    />
                )}
            />
        );
        fireEvent.mouseDown(getByRole('button'));
        expect(queryByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByRole, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            {
                                id: 'programming',
                                foobar: { name: 'Programming' },
                            },
                        ]}
                    />
                )}
            />
        );
        fireEvent.mouseDown(getByRole('button'));
        expect(queryByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByRole, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[{ id: 'programming', foobar: 'Programming' }]}
                    />
                )}
            />
        );
        fireEvent.mouseDown(getByRole('button'));
        expect(queryByText('Programming')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record = undefined }) => <span>{record.foobar}</span>;
        const { getByRole, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        optionText={<Foobar />}
                        choices={[{ id: 'programming', foobar: 'Programming' }]}
                    />
                )}
            />
        );
        fireEvent.mouseDown(getByRole('button'));
        expect(queryByText('Programming')).not.toBeNull();
    });

    it('should render disable choices marked so', () => {
        const { getByRole, getByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 'ang', name: 'Angular' },
                            { id: 'rea', name: 'React', disabled: true },
                        ]}
                    />
                )}
            />
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const option1 = getByText('Angular');
        expect(option1.getAttribute('aria-disabled')).toEqual('false');

        const option2 = getByText('React');
        expect(option2.getAttribute('aria-disabled')).toEqual('true');
    });

    it('should translate the choices', () => {
        const { getByRole, queryByText } = render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => <SelectArrayInput {...defaultProps} />}
                />
            </TestTranslationProvider>
        );
        fireEvent.mouseDown(getByRole('button'));
        expect(queryByText('**Programming**')).not.toBeNull();
        expect(queryByText('**Lifestyle**')).not.toBeNull();
    });

    it('should display helperText if prop is specified', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                )}
            />
        );
        expect(queryByText('Can I help you?')).toBeDefined();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const validate = () => 'Required field.';
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectArrayInput
                            {...defaultProps}
                            validate={validate}
                        />
                    )}
                />
            );
            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const validate = () => 'Required field.';
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectArrayInput
                            {...defaultProps}
                            validate={validate}
                        />
                    )}
                />
            );
            expect(queryByText('Required field.')).toBeDefined();
        });

        it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
            const { queryByRole } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectArrayInput
                            {...{
                                ...defaultProps,
                                loaded: true,
                                loading: true,
                            }}
                        />
                    )}
                />
            );

            expect(queryByRole('progressbar')).toBeNull();
        });

        it('should render a LinearProgress if loading is true and a second has passed', async () => {
            const { queryByRole } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectArrayInput
                            {...{
                                ...defaultProps,
                                loaded: true,
                                loading: true,
                            }}
                        />
                    )}
                />
            );

            await new Promise(resolve => setTimeout(resolve, 1001));

            expect(queryByRole('progressbar')).not.toBeNull();
        });

        it('should not render a LinearProgress if loading is false', () => {
            const { queryByRole } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => <SelectArrayInput {...defaultProps} />}
                />
            );

            expect(queryByRole('progressbar')).toBeNull();
        });
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const { getByLabelText, getByRole, getByText, queryAllByText } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        onCreate={() => {
                            choices.push(newChoice);
                            return newChoice;
                        }}
                    />
                )}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();
        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(queryAllByText(newChoice.name).length).toEqual(2);
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const { getByLabelText, getByRole, getByText, queryAllByText } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
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
        );

        const input = getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();

        await waitFor(() => {
            // 2 because there is both the chip for the new selected item and the option (event if hidden)
            expect(queryAllByText(newChoice.name).length).toEqual(2);
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

        const { getByLabelText, getByRole, getByText, queryAllByText } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        onCreate={() => {
                            choices.push(newChoice);
                            return newChoice;
                        }}
                        optionText="name.en"
                    />
                )}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();
        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(queryAllByText(newChoice.name.en).length).toEqual(2);
    });

    it('should support creation of a new choice with function optionText', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const { getByLabelText, getByRole, getByText, queryAllByText } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        onCreate={() => {
                            choices.push(newChoice);
                            return newChoice;
                        }}
                        optionText={item => item.name}
                    />
                )}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();
        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(queryAllByText(newChoice.name).length).toEqual(2);
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

        const { getByLabelText, getByRole, getByText, queryAllByText } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        create={<Create />}
                    />
                )}
            />
        );

        const input = getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        input.focus();
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        fireEvent.click(getByText('ra.action.create'));
        fireEvent.click(getByText('Get the kid'));
        input.blur();

        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(queryAllByText(newChoice.name).length).toEqual(2);
    });
});
