import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { TestTranslationProvider } from 'ra-core';

import SelectInput from './SelectInput';
import { required } from 'ra-core';

describe('<SelectInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        source: 'language',
        resource: 'posts',
        choices: [{ id: 'ang', name: 'Angular' }, { id: 'rea', name: 'React' }],
    };

    it('should use the input parameter value as the initial input value', () => {
        const { container } = render(
            <Form
                initialValues={{ language: 'ang' }}
                onSubmit={jest.fn()}
                render={() => <SelectInput {...defaultProps} />}
            />
        );
        const input = container.querySelector('input');
        expect(input.value).toEqual('ang');
    });

    it('should render choices as mui MenuItem components', async () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <SelectInput {...defaultProps} />}
            />
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
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const option1 = getByText('Angular');
        expect(option1.getAttribute('aria-disabled')).toEqual('false');

        const option2 = getByText('React');
        expect(option2.getAttribute('aria-disabled')).toEqual('true');
    });

    it('should add an empty menu when allowEmpty is true', () => {
        const { getByRole, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <SelectInput {...defaultProps} allowEmpty />}
            />
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
        );
        const emptyOption = getByRole('button');
        fireEvent.mouseDown(emptyOption);

        const options = queryAllByRole('option');
        expect(options.length).toEqual(3);

        expect(getByText('Empty choice')).not.toBeNull();
    });

    it('should not add a falsy (null or false) element when allowEmpty is false', () => {
        const { getByRole, queryAllByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <SelectInput {...defaultProps} />}
            />
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        const options = queryAllByRole('option');
        expect(options.length).toEqual(2);
    });

    it('should use optionValue as value identifier', () => {
        const { getByRole, getByText } = render(
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
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByRole, getByText } = render(
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
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByRole, getByText } = render(
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
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByRole, getByText } = render(
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
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByRole, getByText } = render(
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
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);

        const option = getByLabelText('Angular');
        expect(option.getAttribute('data-value')).toEqual('ang');
    });

    it('should translate the choices by default', () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn()}
                    render={() => <SelectInput {...defaultProps} />}
                />
            </TestTranslationProvider>
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

    it('should displayed helperText if prop is present', () => {
        const { getByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <SelectInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                )}
            />
        );
        const helperText = getByText('Can I help you?');
        expect(helperText).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryAllByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const error = queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { getByLabelText, queryAllByText } = render(
                <Form
                    validateOnBlur
                    initialValues={{ language: 'ang' }}
                    onSubmit={jest.fn()}
                    render={() => (
                        <SelectInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.language *');
            fireEvent.blur(input);

            const error = queryAllByText('ra.validation.required');
            expect(error.length).toEqual(0);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, getByRole, getByText } = render(
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
            );
            const input = getByLabelText('resources.posts.fields.language *');

            const select = getByRole('button');
            fireEvent.mouseDown(select);

            const optionAngular = getByText('Angular');
            fireEvent.click(optionAngular);
            fireEvent.blur(input);
            fireEvent.blur(select);

            const optionEmpty = getByText('Empty');
            fireEvent.click(optionEmpty);
            fireEvent.blur(input);
            fireEvent.blur(select);

            const error = getByText('ra.validation.required');
            expect(error).not.toBeNull();
        });
    });
});
