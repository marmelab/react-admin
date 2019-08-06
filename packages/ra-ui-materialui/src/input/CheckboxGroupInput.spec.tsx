import React from 'react';
import expect from 'expect';
import CheckboxGroupInput from './CheckboxGroupInput';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required, renderWithRedux } from 'ra-core';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'tags',
        choices: [{ id: 1, name: 'John doe' }],
    };

    afterEach(cleanup);

    it('should render choices as checkbox components', () => {
        const { getByLabelText } = render(
            <Form
                initialValues={{
                    tags: ['ang'],
                }}
                onSubmit={jest.fn()}
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
        const input1 = getByLabelText('Angular');
        expect(input1.getAttribute('type')).toBe('checkbox');
        expect(input1.getAttribute('value')).toBe('ang');
        expect(input1.getAttribute('checked')).toBeDefined();
        const input2 = getByLabelText('React');
        expect(input2.getAttribute('type')).toBe('checkbox');
        expect(input2.getAttribute('value')).toBe('rct');
        expect(input2.getAttribute('checked')).toBeNull();
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ tags: ['ang'] }}
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
        const input1 = getByLabelText('Angular');
        expect(input1.getAttribute('checked')).toBeDefined();
        const input2 = getByLabelText('React');
        expect(input2.getAttribute('checked')).toBeNull();
    });

    it('should use optionValue as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[{ foobar: 'foo', name: 'Bar' }]}
                    />
                )}
            />
        );
        expect(getByLabelText('Bar').getAttribute('value')).toBe('foo');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[{ foobar: { id: 'foo' }, name: 'Bar' }]}
                    />
                )}
            />
        );
        expect(getByLabelText('Bar').getAttribute('value')).toBe('foo');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
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
                onSubmit={jest.fn()}
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
                onSubmit={jest.fn()}
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
        const Foobar = ({ record }: { record?: any }) => (
            <span data-testid="label">{record.foobar}</span>
        );
        const { queryByLabelText, queryByTestId } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        optionText={<Foobar />}
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
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        choices={[
                            { id: 'ang', name: 'app.choices.ang' },
                            { id: 'rct', name: 'app.choices.rct' },
                        ]}
                    />
                )}
            />,
            {
                i18n: {
                    messages: {
                        app: {
                            choices: {
                                ang: 'Angular',
                                rct: 'React',
                            },
                        },
                    },
                },
            }
        );
        expect(queryByLabelText('Angular')).not.toBeNull();
        expect(queryByLabelText('React')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { queryByLabelText } = renderWithRedux(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <CheckboxGroupInput
                        {...defaultProps}
                        translateChoice={false}
                        choices={[
                            { id: 'ang', name: 'app.choices.ang' },
                            { id: 'rct', name: 'app.choices.rct' },
                        ]}
                    />
                )}
            />,
            {
                i18n: {
                    messages: {
                        app: {
                            choices: {
                                ang: 'Angular',
                                rct: 'React',
                            },
                        },
                    },
                },
            }
        );
        expect(queryByLabelText('Angular')).toBeNull();
        expect(queryByLabelText('React')).toBeNull();
        expect(queryByLabelText('app.choices.ang')).not.toBeNull();
        expect(queryByLabelText('app.choices.rct')).not.toBeNull();
    });

    it('should displayed helperText', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn()}
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
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );

            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            fireEvent.click(getByLabelText('John doe'));

            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, getByText } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <CheckboxGroupInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            const checkbox = getByLabelText('John doe');

            fireEvent.click(checkbox);
            fireEvent.click(checkbox);
            fireEvent.blur(checkbox);

            expect(getByText('ra.validation.required')).not.toBeNull();
        });
    });
});
