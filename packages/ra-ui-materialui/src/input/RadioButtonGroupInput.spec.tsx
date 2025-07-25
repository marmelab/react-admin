import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    ResourceContextProvider,
    testDataProvider,
    TestTranslationProvider,
    useRecordContext,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { RadioButtonGroupInput } from './RadioButtonGroupInput';
import {
    InsideReferenceArrayInput,
    Themed,
    TranslateChoice,
} from './RadioButtonGroupInput.stories';

describe('<RadioButtonGroupInput />', () => {
    const defaultProps = {
        source: 'type',
        choices: [
            { id: 'visa', name: 'VISA' },
            { id: 'mastercard', name: 'Mastercard' },
        ],
    };

    it('should render choices as radio inputs', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            label="Credit card"
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Credit card')).not.toBeNull();
        const input1 = screen.getByLabelText('VISA') as HTMLInputElement;
        expect(input1.type).toBe('radio');
        expect(input1.name).toBe('type');
        expect(input1.checked).toEqual(true);
        const input2 = screen.getByLabelText('Mastercard') as HTMLInputElement;
        expect(input2.type).toBe('radio');
        expect(input2.name).toBe('type');
        expect(input2.checked).toBeFalsy();
    });

    it('should set labels correctly for react component choices', () => {
        const FullNameField = ({ record }) => (
            <span>
                {record.first_name} {record.last_name}
            </span>
        );

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            resource={'people'}
                            source="type"
                            choices={[
                                {
                                    id: 123,
                                    first_name: 'Leo',
                                    last_name: 'Tolstoi',
                                },
                                {
                                    id: 456,
                                    first_name: 'Jane',
                                    last_name: 'Austen',
                                },
                            ]}
                            optionText={record => (
                                <FullNameField record={record} />
                            )}
                            label="People"
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('People')).not.toBeNull();
        const input1 = screen.getByLabelText('Leo Tolstoi');
        expect(input1.id).toMatch(/:r\d:/);
        const input2 = screen.getByLabelText('Jane Austen');
        expect(input2.id).toMatch(/:r\d:/);
        expect(input2.id).not.toEqual(input1.id);
    });

    it('should trigger custom onChange when clicking radio button', async () => {
        const onChange = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            label="Credit card"
                            onChange={onChange}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Credit card')).not.toBeNull();

        const input2 = screen.getByLabelText('Mastercard') as HTMLInputElement;
        fireEvent.click(input2);
        await waitFor(() => {
            expect(onChange).toBeCalledWith(expect.anything(), 'mastercard');
        });

        const input1 = screen.getByLabelText('VISA') as HTMLInputElement;
        fireEvent.click(input1);
        await waitFor(() => {
            expect(onChange).toBeCalledWith(expect.anything(), 'visa');
        });
    });

    it('should use the value provided by the form default values', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ type: 'mastercard' }}
                    >
                        <RadioButtonGroupInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            (screen.getByLabelText('VISA') as HTMLInputElement).checked
        ).toBeFalsy();
        expect(
            (screen.getByLabelText('Mastercard') as HTMLInputElement).checked
        ).toBeTruthy();
    });

    it('should work correctly when ids are numbers', () => {
        const choices = [
            { id: 1, name: 'VISA' },
            { id: 2, name: 'Mastercard' },
        ];
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        defaultValues={{ type: 1 }}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            choices={choices}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText('Mastercard') as HTMLInputElement;
        expect(input.checked).toBe(false);
        fireEvent.click(input);
        expect(input.checked).toBe(true);
    });

    it('should use optionValue as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'mc' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            optionValue="short"
                            choices={[{ short: 'mc', name: 'Mastercard' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            (screen.getByLabelText('Mastercard') as HTMLInputElement).value
        ).toBe('mc');
    });

    it('should use optionValue including "." as value identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'mc' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            optionValue="details.id"
                            choices={[
                                { details: { id: 'mc' }, name: 'Mastercard' },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            (screen.getByLabelText('Mastercard') as HTMLInputElement).value
        ).toBe('mc');
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'mc' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            optionText="longname"
                            choices={[{ id: 'mc', longname: 'Mastercard' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Mastercard')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'mc' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            optionText="details.name"
                            choices={[
                                { id: 'mc', details: { name: 'Mastercard' } },
                            ]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Mastercard')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'mc' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            optionText={choice => choice.longname}
                            choices={[{ id: 'mc', longname: 'Mastercard' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Mastercard')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = () => {
            const record = useRecordContext();
            return <span data-testid="label">{record?.longname}</span>;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'mc' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            optionText={<Foobar />}
                            choices={[{ id: 'mc', longname: 'Mastercard' }]}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Mastercard')).not.toBeNull();
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        const inputs = await screen.findAllByTestId('themed');
        expect(inputs).toHaveLength(3);
    });

    describe('translateChoice', () => {
        it('should translate the choices by default', async () => {
            render(<TranslateChoice />);
            const label = await screen.findByText('translateChoice default');
            const options =
                label.parentNode?.parentNode?.childNodes[1].childNodes;
            expect(options![1].textContent).toBe('Female');
        });
        it('should not translate the choices when translateChoice is false', async () => {
            render(<TranslateChoice />);
            const label = await screen.findByText('translateChoice false');
            const options =
                label.parentNode?.parentNode?.childNodes[1].childNodes;
            expect(options![1].textContent).toBe('option.female');
        });
        it('should not translate the choices when inside ReferenceInput by default', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const label = screen.getByText('inside ReferenceInput');
                const options =
                    label.parentNode?.parentNode?.childNodes[1].childNodes;
                expect(options![1].textContent).toBe('option.female');
            });
        });
        it('should translate the choices when inside ReferenceInput when translateChoice is true', async () => {
            render(<TranslateChoice />);
            await waitFor(() => {
                const label = screen.getByText('inside ReferenceInput forced');
                const options =
                    label.parentNode?.parentNode?.childNodes[1].childNodes;
                expect(options![1].textContent).toBe('Female');
            });
        });
    });

    it('should not translate the choices if translateChoice is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <ResourceContextProvider value="creditcards">
                        <SimpleForm
                            defaultValues={{ type: 'mc' }}
                            onSubmit={jest.fn()}
                        >
                            <RadioButtonGroupInput
                                {...defaultProps}
                                choices={[{ id: 'mc', name: 'Mastercard' }]}
                                translateChoice={false}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </TestTranslationProvider>
            </AdminContext>
        );
        expect(screen.queryByText('**Mastercard**')).toBeNull();
        expect(screen.queryByText('Mastercard')).not.toBeNull();
    });

    it('should display helperText if prop is present in meta', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput
                            {...defaultProps}
                            helperText="Can I help you?"
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="creditcards">
                        <SimpleForm
                            defaultValues={{ type: 'visa' }}
                            onSubmit={jest.fn()}
                            mode="onBlur"
                        >
                            <RadioButtonGroupInput
                                {...defaultProps}
                                validate={validate}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="creditcards">
                        <SimpleForm
                            defaultValues={{ type: 'visa' }}
                            onSubmit={jest.fn()}
                            mode="onBlur"
                        >
                            <RadioButtonGroupInput
                                {...defaultProps}
                                validate={validate}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );

            const input = screen.getByLabelText(
                'Mastercard'
            ) as HTMLInputElement;
            fireEvent.click(input);
            expect(input.checked).toBe(true);

            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('ra.validation.error')).not.toBeNull();
            });
        });

        it('should be displayed even with a helper Text', async () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="creditcards">
                        <SimpleForm
                            defaultValues={{ type: 'visa' }}
                            onSubmit={jest.fn()}
                            mode="onBlur"
                        >
                            <RadioButtonGroupInput
                                {...defaultProps}
                                validate={validate}
                                helperText="Can I help you?"
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            const input = screen.getByLabelText(
                'Mastercard'
            ) as HTMLInputElement;
            fireEvent.click(input);
            expect(input.checked).toBe(true);

            fireEvent.blur(input);

            await waitFor(() => {
                expect(screen.getByText('ra.validation.error')).not.toBeNull();
            });
            expect(screen.queryByText('Can I help you?')).toBeNull();
        });
    });

    it('should not render a LinearProgress if isPending is true and a second has not passed yet', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput {...defaultProps} isPending />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should render a LinearProgress if isPending is true and a second has passed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput {...defaultProps} isPending />
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
                <ResourceContextProvider value="creditcards">
                    <SimpleForm
                        defaultValues={{ type: 'visa' }}
                        onSubmit={jest.fn()}
                    >
                        <RadioButtonGroupInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.queryByRole('progressbar')).toBeNull();
    });

    it('should render disabled choices marked as so', () => {
        const choices = [
            { id: 1, name: 'VISA' },
            { id: 2, name: 'Mastercard', disabled: true },
        ];
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm onSubmit={jest.fn()}>
                        <RadioButtonGroupInput
                            {...defaultProps}
                            choices={choices}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        fireEvent.mouseDown(screen.getByLabelText('Mastercard'));

        const enabledInput = screen.getByLabelText('VISA') as HTMLInputElement;
        expect(enabledInput.disabled).toBe(false);

        const disabledInput = screen.getByLabelText(
            'Mastercard'
        ) as HTMLInputElement;
        expect(disabledInput.disabled).toBe(true);
    });

    it('should render disabled choices marked as so by disableValue prop', () => {
        const choices = [
            { id: 1, name: 'VISA' },
            { id: 2, name: 'Mastercard', not_available: true },
        ];
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="creditcards">
                    <SimpleForm onSubmit={jest.fn()}>
                        <RadioButtonGroupInput
                            {...defaultProps}
                            choices={choices}
                            disableValue="not_available"
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        fireEvent.mouseDown(screen.getByLabelText('Mastercard'));

        const enabledInput = screen.getByLabelText('VISA') as HTMLInputElement;
        expect(enabledInput.disabled).toBe(false);

        const disabledInput = screen.getByLabelText(
            'Mastercard'
        ) as HTMLInputElement;
        expect(disabledInput.disabled).toBe(true);
    });

    describe('inside ReferenceArrayInput', () => {
        it('should use the recordRepresentation as optionText', async () => {
            render(<InsideReferenceArrayInput />);

            await screen.findByText('Lifestyle (Lifestyle details)');
            await screen.findByText('Tech (Tech details)');
            await screen.findByText('People (People details)');
        });
    });
});
