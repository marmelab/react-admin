import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';

import { SelectArrayInput } from './SelectArrayInput';

describe('<SelectArrayInput />', () => {
    const defaultProps = {
        classes: {},
        resource: 'bar',
        source: 'foo',
        meta: {},
        input: { onChange: () => null, onBlur: () => null },
        translate: x => x,
    };

    afterEach(cleanup);

    it('should use a mui Select', () => {
        const { queryByTestId } = render(<SelectArrayInput {...defaultProps} input={{}} />);
        expect(queryByTestId('selectArray')).not.toBeNull();
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <SelectArrayInput
                {...defaultProps}
                input={{ value: ['programming', 'lifestyle'] }}
                choices={[
                    { id: 'programming', name: 'Programming' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'lorem', name: 'Lorem' },
                ]}
            />
        );
        expect(getByLabelText('resources.bar.fields.foo').value).toBe('programming,lifestyle');
    });

    it('should reveal choices on click', () => {
        const { getByRole, queryByText } = render(
            <SelectArrayInput
                {...defaultProps}
                choices={[
                    { id: 'programming', name: 'Programming' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'photography', name: 'Photography' },
                ]}
            />
        );
        expect(queryByText('Programming')).toBeNull();
        expect(queryByText('Lifestyle')).toBeNull();
        expect(queryByText('Photography')).toBeNull();
        getByRole('button').click();
        expect(queryByText('Programming')).not.toBeNull();
        expect(queryByText('Lifestyle')).not.toBeNull();
        expect(queryByText('Photography')).not.toBeNull();
    });

    it('should use optionValue as value identifier', () => {
        const { getByRole, getByText, getByLabelText } = render(
            <SelectArrayInput {...defaultProps} optionValue="foobar" choices={[{ foobar: 'M', name: 'Male' }]} />
        );
        getByRole('button').click();
        getByText('Male').click();
        expect(getByLabelText('resources.bar.fields.foo').value).toBe('M');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByRole, getByText, getByLabelText } = render(
            <SelectArrayInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'M' }, name: 'Male' }]}
            />
        );
        getByRole('button').click();
        getByText('Male').click();
        expect(getByLabelText('resources.bar.fields.foo').value).toBe('M');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByRole, queryByText } = render(
            <SelectArrayInput {...defaultProps} optionText="foobar" choices={[{ id: 'M', foobar: 'Male' }]} />
        );
        getByRole('button').click();
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByRole, queryByText } = render(
            <SelectArrayInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
            />
        );
        getByRole('button').click();
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByRole, queryByText } = render(
            <SelectArrayInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        getByRole('button').click();
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const { getByRole, queryByText } = render(
            <SelectArrayInput {...defaultProps} optionText={<Foobar />} choices={[{ id: 'M', foobar: 'Male' }]} />
        );
        getByRole('button').click();
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should translate the choices', () => {
        const { getByRole, queryByText } = render(
            <SelectArrayInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }]}
                translate={x => `**${x}**`}
            />
        );
        getByRole('button').click();
        expect(queryByText('**Male**')).not.toBeNull();
        expect(queryByText('**Female**')).not.toBeNull();
    });

    it('should displayed helperText if prop is present in meta', () => {
        const { queryByText } = render(<SelectArrayInput {...defaultProps} meta={{ helperText: 'Can I help you?' }} />);
        expect(queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { container } = render(<SelectArrayInput {...defaultProps} meta={{ touched: false }} />);
            expect(container.querySelector('p')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { container } = render(<SelectArrayInput {...defaultProps} meta={{ touched: true, error: false }} />);
            expect(container.querySelector('p')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { container, queryByText } = render(
                <SelectArrayInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />
            );
            expect(container.querySelector('p')).not.toBeNull();
            expect(queryByText('Required field.')).not.toBeNull();
        });

        it('should be displayed with an helper Text', () => {
            const { queryByText } = render(
                <SelectArrayInput
                    {...defaultProps}
                    meta={{
                        touched: true,
                        error: 'Required field.',
                        helperText: 'Can I help you?',
                    }}
                />
            );
            expect(queryByText('Required field.')).not.toBeNull();
            expect(queryByText('Can I help you?')).not.toBeNull();
        });
    });
});
