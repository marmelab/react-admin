import * as React from 'react';
import expect from 'expect';
import CheckboxGroupInput from './CheckboxGroupInput';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { renderWithRedux, TestTranslationProvider } from 'ra-core';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        source: 'tags',
        resource: 'posts',
        choices: [
            { id: 'ang', name: 'Angular' },
            { id: 'rct', name: 'React' },
        ],
    };

    afterEach(cleanup);

    it('should render choices as checkbox components', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <CheckboxGroupInput {...defaultProps} />}
            />
        );
        const input1 = getByLabelText('Angular') as HTMLInputElement;
        expect(input1.type).toBe('checkbox');
        expect(input1.value).toBe('ang');
        expect(input1.checked).toBe(false);
        const input2 = getByLabelText('React') as HTMLInputElement;
        expect(input2.type).toBe('checkbox');
        expect(input2.value).toBe('rct');
        expect(input2.checked).toBe(false);
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    tags: ['ang'],
                }}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        choices={[
                            { id: 'ang', name: 'Angular' },
                            { id: 'rct', name: 'React' },
                        ]}
                    />
                )}
            />
        );
        const input1 = getByLabelText('Angular') as HTMLInputElement;
        expect(input1.checked).toEqual(true);
        const input2 = getByLabelText('React') as HTMLInputElement;
        expect(input2.checked).toEqual(false);
    });

    it('should use optionValue as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[{ foobar: 'foo', name: 'Bar' }]}
                    />
                )}
            />
        );
        const input = getByLabelText('Bar') as HTMLInputElement;
        expect(input.value).toBe('foo');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[{ foobar: { id: 'foo' }, name: 'Bar' }]}
                    />
                )}
            />
        );
        const input = getByLabelText('Bar') as HTMLInputElement;
        expect(input.value).toBe('foo');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[{ id: 'foo', foobar: { name: 'Bar' } }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => (
            <span data-testid="label">{record.foobar}</span>
        );
        const { queryByLabelText, queryByTestId } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={<Foobar record={{}} />}
                        choices={[{ id: 'foo', foobar: 'Bar' }]}
                    />
                )}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
        expect(queryByTestId('label')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { queryByLabelText } = renderWithRedux(
            <TestTranslationProvider
                messages={{
                    Angular: 'Angular **',
                    React: 'React **',
                }}
            >
                <Form
                    onSubmit={jest.fn}
                    render={() => <CheckboxGroupInput {...defaultProps} />}
                />
            </TestTranslationProvider>
        );
        expect(queryByLabelText('Angular **')).not.toBeNull();
        expect(queryByLabelText('React **')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { queryByLabelText } = renderWithRedux(
            <TestTranslationProvider
                messages={{
                    Angular: 'Angular **',
                    React: 'React **',
                }}
            >
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            translateChoice={false}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(queryByLabelText('Angular **')).toBeNull();
        expect(queryByLabelText('React **')).toBeNull();
        expect(queryByLabelText('Angular')).not.toBeNull();
        expect(queryByLabelText('React')).not.toBeNull();
    });

    it('should display helperText', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <CheckboxGroupInput
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
            const { container } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => <CheckboxGroupInput {...defaultProps} />}
                />
            );
            expect(container.querySelector('p').innerHTML).toBe(
                '<span>​</span>'
            );
        });

        it('should be empty if field has been touched but is valid', () => {
            const { container } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => <CheckboxGroupInput {...defaultProps} />}
                />
            );
            expect(container.querySelector('p').innerHTML).toBe(
                '<span>​</span>'
            );
        });

        it('should be displayed if field has been touched and is invalid', () => {
            // This validator always returns an error
            const validate = () => 'ra.validation.error';

            const { queryByLabelText, getByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={validate}
                        />
                    )}
                />
            );
            const input = queryByLabelText('Angular') as HTMLInputElement;
            fireEvent.click(input);
            expect(input.checked).toBe(true);

            fireEvent.blur(input);
            const error = getByText('ra.validation.error');
            expect(error).toBeDefined();
            expect(error.classList.contains('Mui-error')).toEqual(true);
        });
    });
});
