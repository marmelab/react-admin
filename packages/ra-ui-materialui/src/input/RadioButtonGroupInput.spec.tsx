import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { TestTranslationProvider } from 'ra-core';

import RadioButtonGroupInput from './RadioButtonGroupInput';

describe('<RadioButtonGroupInput />', () => {
    const defaultProps = {
        resource: 'creditcards',
        source: 'type',
        choices: [
            { id: 'visa', name: 'VISA' },
            { id: 'mastercard', name: 'Mastercard' },
        ],
    };

    it('should render choices as radio inputs', () => {
        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        label="Credit card"
                    />
                )}
            />
        );
        expect(queryByText('Credit card')).not.toBeNull();
        const input1 = getByLabelText('VISA') as HTMLInputElement;
        expect(input1.type).toBe('radio');
        expect(input1.name).toBe('type');
        expect(input1.checked).toBeFalsy();
        const input2 = getByLabelText('Mastercard') as HTMLInputElement;
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

        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
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
                        optionText={record => <FullNameField record={record} />}
                        label="People"
                    />
                )}
            />
        );
        expect(queryByText('People')).not.toBeNull();
        const input1 = getByLabelText('Leo Tolstoi');
        expect(input1.id).toBe('type_123');
        const input2 = getByLabelText('Jane Austen');
        expect(input2.id).toBe('type_456');
    });

    it('should trigger custom onChange when clicking radio button', async () => {
        const onChange = jest.fn();
        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        label="Credit card"
                        onChange={onChange}
                    />
                )}
            />
        );
        expect(queryByText('Credit card')).not.toBeNull();
        const input1 = getByLabelText('VISA') as HTMLInputElement;
        fireEvent.click(input1);
        expect(onChange).toBeCalledWith('visa');

        const input2 = getByLabelText('Mastercard') as HTMLInputElement;
        fireEvent.click(input2);
        expect(onChange).toBeCalledWith('mastercard');
    });

    it('should use the value provided by final-form as the initial input value', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{ type: 'mastercard' }}
                render={() => <RadioButtonGroupInput {...defaultProps} />}
            />
        );
        expect(
            (getByLabelText('VISA') as HTMLInputElement).checked
        ).toBeFalsy();
        expect(
            (getByLabelText('Mastercard') as HTMLInputElement).checked
        ).toBeTruthy();
    });

    it('should work correctly when ids are numbers', () => {
        const choices = [
            { id: 1, name: 'VISA' },
            { id: 2, name: 'Mastercard' },
        ];
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        choices={choices}
                    />
                )}
            />
        );
        const input = getByLabelText('Mastercard') as HTMLInputElement;
        expect(input.checked).toBe(false);
        fireEvent.click(input);
        expect(input.checked).toBe(true);
    });

    it('should use optionValue as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        optionValue="short"
                        choices={[{ short: 'mc', name: 'Mastercard' }]}
                    />
                )}
            />
        );
        expect((getByLabelText('Mastercard') as HTMLInputElement).value).toBe(
            'mc'
        );
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        optionValue="details.id"
                        choices={[
                            { details: { id: 'mc' }, name: 'Mastercard' },
                        ]}
                    />
                )}
            />
        );
        expect((getByLabelText('Mastercard') as HTMLInputElement).value).toBe(
            'mc'
        );
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        optionText="longname"
                        choices={[{ id: 'mc', longname: 'Mastercard' }]}
                    />
                )}
            />
        );
        expect(queryByText('Mastercard')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        optionText="details.name"
                        choices={[
                            { id: 'mc', details: { name: 'Mastercard' } },
                        ]}
                    />
                )}
            />
        );
        expect(queryByText('Mastercard')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        optionText={choice => choice.longname}
                        choices={[{ id: 'mc', longname: 'Mastercard' }]}
                    />
                )}
            />
        );
        expect(queryByText('Mastercard')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }: { record?: any }) => (
            <span>{record.longname}</span>
        );
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        optionText={<Foobar />}
                        choices={[{ id: 'mc', longname: 'Mastercard' }]}
                    />
                )}
            />
        );
        expect(queryByText('Mastercard')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { queryByText } = render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <RadioButtonGroupInput
                            {...defaultProps}
                            choices={[{ id: 'mc', name: 'Mastercard' }]}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(queryByText('**Mastercard**')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { queryByText } = render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <RadioButtonGroupInput
                            {...defaultProps}
                            choices={[{ id: 'mc', name: 'Mastercard' }]}
                            translateChoice={false}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(queryByText('**Mastercard**')).toBeNull();
        expect(queryByText('Mastercard')).not.toBeNull();
    });

    it('should display helperText if prop is present in meta', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <RadioButtonGroupInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                )}
            />
        );
        expect(queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <RadioButtonGroupInput
                            {...defaultProps}
                            validate={validate}
                        />
                    )}
                />
            );
            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            const { getByLabelText, getByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <RadioButtonGroupInput
                            {...defaultProps}
                            validate={validate}
                        />
                    )}
                />
            );

            const input = getByLabelText('Mastercard') as HTMLInputElement;
            input.focus();
            fireEvent.click(input);
            expect(input.checked).toBe(true);

            input.blur();

            expect(getByText('ra.validation.error')).not.toBeNull();
        });

        it('should be displayed even with a helper Text', () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            const { getByLabelText, getByText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <RadioButtonGroupInput
                            {...defaultProps}
                            validate={validate}
                            helperText="Can I help you?"
                        />
                    )}
                />
            );
            const input = getByLabelText('Mastercard') as HTMLInputElement;
            input.focus();
            fireEvent.click(input);
            expect(input.checked).toBe(true);

            input.blur();

            const error = getByText('ra.validation.error');
            expect(error).toBeDefined();
            expect(error.classList.contains('Mui-error')).toEqual(true);
            expect(queryByText('Can I help you?')).toBeNull();
        });
    });

    it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
        const { queryByRole } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <RadioButtonGroupInput
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
                    <RadioButtonGroupInput
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
                render={() => (
                    <RadioButtonGroupInput
                        {...{
                            ...defaultProps,
                        }}
                    />
                )}
            />
        );

        expect(queryByRole('progressbar')).toBeNull();
    });
});
