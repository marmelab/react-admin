import React from 'react';
import assert from 'assert';
import { render, cleanup, fireEvent } from 'react-testing-library';

import { SelectInput } from './SelectInput';
import { TranslationContext } from 'ra-core';

describe('<SelectInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        // We have to specify the id ourselves here because the
        // TextInput is not wrapped inside a FormInput
        id: 'foo',
        source: 'foo',
        resource: 'bar',
        meta: {},
        input: { value: '' },
    };

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <SelectInput {...defaultProps} input={{ value: 2 }} />
        );
        const TextFieldElement = getByLabelText('resources.bar.fields.foo');
        assert.equal(TextFieldElement.value, '2');
    });

    it('should render choices as mui MenuItem components', () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <SelectInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);
        const options = queryAllByRole('option');
        assert.equal(options.length, 2);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');

        const optionFemale = getByText('Female');
        assert.equal(optionFemale.getAttribute('data-value'), 'F');
    });

    it('should render disable choices marked so', () => {
        const { getByRole, getByText } = render(
            <SelectInput
                {...defaultProps}
                choices={[
                    { id: 123, name: 'Leo Tolstoi', sex: 'M' },
                    { id: 456, name: 'Jane Austen', sex: 'F' },
                    {
                        id: 1,
                        name: 'System Administrator',
                        sex: 'F',
                        disabled: true,
                    },
                ]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);
        const option1 = getByText('Leo Tolstoi');
        assert.equal(option1.getAttribute('aria-disabled'), 'false');

        const option2 = getByText('Jane Austen');
        assert.equal(option2.getAttribute('aria-disabled'), 'false');

        const option3 = getByText('System Administrator');
        assert.equal(option3.getAttribute('aria-disabled'), 'true');
    });

    it('should add an empty menu when allowEmpty is true', () => {
        const { getByRole, queryAllByRole } = render(
            <SelectInput
                {...defaultProps}
                allowEmpty
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const options = queryAllByRole('option');
        assert.equal(options.length, 3);
        assert.equal(options[0].getAttribute('data-value'), '');
    });

    it('should add an empty menu with custom value when allowEmpty is true', () => {
        const emptyValue = 'test';

        const { getByRole, queryAllByRole } = render(
            <SelectInput
                {...defaultProps}
                allowEmpty
                emptyValue={emptyValue}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const options = queryAllByRole('option');
        assert.equal(options.length, 3);
        assert.equal(options[0].getAttribute('data-value'), emptyValue);
    });

    it('should not add a falsy (null or false) element when allowEmpty is false', () => {
        const { getByRole, queryAllByRole } = render(
            <SelectInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);
        const options = queryAllByRole('option');
        assert.equal(options.length, 2);
    });

    it('should use optionValue as value identifier', () => {
        const { getByRole, getByText } = render(
            <SelectInput
                {...defaultProps}
                optionValue="foobar"
                choices={[{ foobar: 'M', name: 'Male' }]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByRole, getByText } = render(
            <SelectInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'M' }, name: 'Male' }]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByRole, getByText } = render(
            <SelectInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByRole, getByText } = render(
            <SelectInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByRole, getByText } = render(
            <SelectInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => (
            <span data-value={record.id} aria-label={record.foobar} />
        );

        const { getByRole, getByLabelText } = render(
            <SelectInput
                {...defaultProps}
                optionText={<Foobar />}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);

        const optionMale = getByLabelText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');
    });

    it('should translate the choices by default', () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <TranslationContext.Provider
                value={{
                    translate: x => `**${x}**`,
                }}
            >
                <SelectInput
                    {...defaultProps}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                />
            </TranslationContext.Provider>
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);
        const options = queryAllByRole('option');
        assert.equal(options.length, 2);

        const optionMale = getByText('**Male**');
        assert.equal(optionMale.getAttribute('data-value'), 'M');

        const optionFemale = getByText('**Female**');
        assert.equal(optionFemale.getAttribute('data-value'), 'F');
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { getByRole, getByText, queryAllByRole } = render(
            <TranslationContext.Provider
                value={{
                    translate: x => `**${x}**`,
                }}
            >
                <SelectInput
                    {...defaultProps}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    translateChoice={false}
                />
            </TranslationContext.Provider>
        );
        const TextFieldElement = getByRole('button');
        fireEvent.click(TextFieldElement);
        const options = queryAllByRole('option');
        assert.equal(options.length, 2);

        const optionMale = getByText('Male');
        assert.equal(optionMale.getAttribute('data-value'), 'M');

        const optionFemale = getByText('Female');
        assert.equal(optionFemale.getAttribute('data-value'), 'F');
    });

    it('should displayed helperText if prop is present in meta', () => {
        const { getByText } = render(
            <SelectInput {...defaultProps} helperText="Can I help you?" />
        );
        const helperText = getByText('Can I help you?');
        assert.ok(helperText);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryAllByText } = render(
                <SelectInput
                    {...defaultProps}
                    meta={{ touched: false, error: 'Required field.' }}
                />
            );
            const error = queryAllByText('Required field.');
            assert.equal(error.length, 0);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { queryAllByText } = render(
                <SelectInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const error = queryAllByText('Required field.');
            assert.equal(error.length, 0);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByText } = render(
                <SelectInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const error = getByText('Required field.');
            assert.ok(error);
        });

        it('should display the error even if helperText is present', () => {
            const { getByText, queryByText } = render(
                <SelectInput
                    {...defaultProps}
                    helperText="Can I help you?"
                    meta={{
                        touched: true,
                        error: 'Required field.',
                    }}
                />
            );
            assert.ok(getByText('Required field.'));
            assert.ok(!queryByText('Can I help you?'));
        });
    });
});
