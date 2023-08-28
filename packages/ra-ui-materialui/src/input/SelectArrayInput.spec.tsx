import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { testDataProvider, useRecordContext } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { SelectArrayInput } from './SelectArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import {
    DifferentIdTypes,
    TranslateChoice,
    InsideArrayInput,
} from './SelectArrayInput.stories';

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
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByTestId('selectArray')).toBeDefined();
    });

    it('should use the input parameter value as the initial input value', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    defaultValues={{ categories: ['programming', 'lifestyle'] }}
                >
                    <SelectArrayInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.getByDisplayValue('programming,lifestyle')
        ).not.toBeNull();
    });

    it('should reveal choices on click', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByText('Programming')).toBeNull();
        expect(screen.queryByText('Lifestyle')).toBeNull();
        expect(screen.queryByText('Photography')).toBeNull();
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        expect(screen.queryByText('Programming')).not.toBeNull();
        expect(screen.queryByText('Lifestyle')).not.toBeNull();
        expect(screen.queryByText('Photography')).not.toBeNull();
    });

    it('should use optionValue as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[
                            { foobar: 'programming', name: 'Programming' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        fireEvent.click(screen.getByText('Programming'));
        expect(screen.getByDisplayValue('programming')).not.toBeNull();
    });

    it('should use optionValue including "." as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
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
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        fireEvent.click(screen.getByText('Programming'));
        expect(screen.getByDisplayValue('programming')).not.toBeNull();
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[{ id: 'programming', foobar: 'Programming' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        expect(screen.queryByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
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
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        expect(screen.queryByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[{ id: 'programming', foobar: 'Programming' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        expect(screen.queryByText('Programming')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = () => {
            const record = useRecordContext();
            return <span>{record.foobar}</span>;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
                        {...defaultProps}
                        optionText={<Foobar />}
                        choices={[{ id: 'programming', foobar: 'Programming' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        fireEvent.mouseDown(
            screen.getByLabelText('resources.posts.fields.categories')
        );
        expect(screen.queryByText('Programming')).not.toBeNull();
    });

    it('should render disable choices marked so', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
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
            screen.getByLabelText('resources.posts.fields.categories')
        );
        const option1 = screen.getByText('Angular');
        expect(option1.getAttribute('aria-disabled')).toBeNull();

        const option2 = screen.getByText('React');
        expect(option2.getAttribute('aria-disabled')).toEqual('true');
    });

    describe('translateChoice', () => {
        it('should translate the choices by default', async () => {
            render(<TranslateChoice />);
            const selectedElement = await screen.findByLabelText(
                'translateChoice default'
            );
            expect(selectedElement.textContent).toBe('Tech');
        });
        it('should not translate the choices when translateChoice is false', async () => {
            render(<TranslateChoice />);
            const selectedElement = await screen.findByLabelText(
                'translateChoice false'
            );
            expect(selectedElement.textContent).toBe('option.tech');
        });
        it('should not translate the choices when inside ReferenceInput by default', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const selectedElement = screen.getByLabelText(
                    'inside ReferenceArrayInput'
                );
                expect(selectedElement.textContent).toBe('option.tech');
            });
        });
        it('should translate the choices when inside ReferenceInput when translateChoice is true', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const selectedElement = screen.getByLabelText(
                    'inside ReferenceArrayInput forced'
                );
                expect(selectedElement.textContent).toBe('Tech');
            });
        });
    });

    it('should display helperText if prop is specified', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByText('Can I help you?')).toBeDefined();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm mode="onBlur" onSubmit={jest.fn()}>
                        <SelectArrayInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );

            expect(screen.queryByText('error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectArrayInput
                            {...defaultProps}
                            validate={() => 'error'}
                        />
                    </SimpleForm>
                </AdminContext>
            );

            fireEvent.blur(
                screen.getByLabelText('resources.posts.fields.categories')
            );
            await waitFor(() => {
                expect(screen.queryByText('error')).toBeDefined();
            });
        });

        it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectArrayInput {...defaultProps} isLoading />
                    </SimpleForm>
                </AdminContext>
            );

            expect(screen.queryByRole('progressbar')).toBeNull();
        });

        it('should render a LinearProgress if loading is true and a second has passed', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectArrayInput {...defaultProps} isLoading />
                    </SimpleForm>
                </AdminContext>
            );

            await new Promise(resolve => setTimeout(resolve, 1001));

            expect(screen.queryByRole('progressbar')).not.toBeNull();
        });

        it('should not render a LinearProgress if loading is false', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <SelectArrayInput {...defaultProps} />
                    </SimpleForm>
                </AdminContext>
            );

            expect(screen.queryByRole('progressbar')).toBeNull();
        });
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
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

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(screen.queryAllByText(newChoice.name).length).toEqual(2);
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
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
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();

        await waitFor(() => {
            // 2 because there is both the chip for the new selected item and the option (event if hidden)
            expect(screen.queryAllByText(newChoice.name).length).toEqual(2);
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
                    <SelectArrayInput
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

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();
        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(screen.queryAllByText(newChoice.name.en).length).toEqual(2);
    });

    it('should support creation of a new choice with function optionText', async () => {
        const choices = [...defaultProps.choices];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        onCreate={() => {
                            choices.push(newChoice);
                            return newChoice;
                        }}
                        optionText={item => item.name}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        await new Promise(resolve => setTimeout(resolve));
        input.blur();
        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(screen.queryAllByText(newChoice.name).length).toEqual(2);
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
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        create={<Create />}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        fireEvent.click(screen.getByText('Get the kid'));
        input.blur();

        // 2 because there is both the chip for the new selected item and the option (event if hidden)
        expect(screen.queryAllByText(newChoice.name).length).toEqual(2);
    });

    it('should recive an event object on change', async () => {
        const choices = [...defaultProps.choices];
        const onChange = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        onChange={onChange}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('Lifestyle'));

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({ isTrusted: false })
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
                    <SelectArrayInput
                        {...defaultProps}
                        choices={choices}
                        create={<Create />}
                        onChange={onChange}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.categories'
        ) as HTMLInputElement;
        fireEvent.mouseDown(input);

        fireEvent.click(screen.getByText('ra.action.create'));
        fireEvent.click(screen.getByText('Get the kid'));
        input.blur();

        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(['js_fatigue']);
        });
    });

    it('should show selected values when ids type are inconsistant', async () => {
        render(<DifferentIdTypes />);
        await waitFor(() => {
            expect(screen.queryByText('artist_1')).not.toBeNull();
        });
        expect(screen.queryByText('artist_2')).not.toBeNull();
        expect(screen.queryByText('artist_3')).toBeNull();
    });

    it('should unselect values when ids type are different', async () => {
        render(<DifferentIdTypes />);

        expect(
            await screen.findByText('resources.bands.fields.members')
        ).not.toBeNull();

        fireEvent.mouseDown(
            screen.getByLabelText('resources.bands.fields.members')
        );

        const option = await screen.findByText('artist_2', {
            selector: '.MuiMenuItem-root',
        });
        fireEvent.click(option);

        expect(
            screen.queryByText('artist_2', {
                selector: '.MuiChip-label',
            })
        ).toBeNull();
    });

    it('should not crash if its value is not an array', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    defaultValues={{ categories: 1 }}
                >
                    <SelectArrayInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByTestId('selectArray')).toBeDefined();
    });

    it('should always apply its default value inside an ArrayInput', async () => {
        render(<InsideArrayInput />);
        await screen.findByText('Foo');
        fireEvent.click(screen.getByLabelText('Remove'));
        await waitFor(() => {
            expect(screen.queryByText('Foo')).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Add'));
        await screen.findByText('Foo');
        fireEvent.click(screen.getByLabelText('Remove'));
        await waitFor(() => {
            expect(screen.queryByText('Foo')).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Add'));
        await screen.findByText('Foo');
        fireEvent.click(screen.getByLabelText('Add'));
        expect(await screen.findAllByText('Foo')).toHaveLength(2);
    });
});
