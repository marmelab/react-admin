import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';

import { RadioButtonGroupInput } from './RadioButtonGroupInput';

describe('<RadioButtonGroupInput />', () => {
    const defaultProps = {
        resource: 'bar',
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    afterEach(cleanup);

    it('should render choices as radio inputs', () => {
        const { getByLabelText, queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                label="hello"
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );
        expect(queryByText('hello')).not.toBeNull();
        const input1 = getByLabelText('Male');
        expect(input1.type).toBe('radio');
        expect(input1.name).toBe('foo');
        expect(input1.checked).toBeFalsy();
        const input2 = getByLabelText('Female');
        expect(input2.type).toBe('radio');
        expect(input2.name).toBe('foo');
        expect(input2.checked).toBeFalsy();
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                input={{ value: 'F' }}
            />
        );
        expect(getByLabelText('Male').checked).toBeFalsy();
        expect(getByLabelText('Female').checked).toBeTruthy();
    });

    it('should use optionValue as value identifier', () => {
        const { getByLabelText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                optionValue="foobar"
                choices={[{ foobar: 'M', name: 'Male' }]}
            />
        );
        expect(getByLabelText('Male').value).toBe('M');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByLabelText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'M' }, name: 'Male' }]}
            />
        );
        expect(getByLabelText('Male').value).toBe('M');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText="foobar"
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'M', foobar: { name: 'Male' } }]}
            />
        );
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span>{record.foobar}</span>;
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                optionText={<Foobar />}
                choices={[{ id: 'M', foobar: 'Male' }]}
            />
        );
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
            />
        );
        expect(queryByText('**Male**')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                choices={[{ id: 'M', name: 'Male' }]}
                translate={x => `**${x}**`}
                translateChoice={false}
            />
        );
        expect(queryByText('**Male**')).toBeNull();
        expect(queryByText('Male')).not.toBeNull();
    });

    it('should displayed helperText if prop is present in meta', () => {
        const { queryByText } = render(
            <RadioButtonGroupInput
                {...defaultProps}
                meta={{ helperText: 'Can I help you?' }}
            />
        );
        expect(queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { container } = render(
                <RadioButtonGroupInput
                    {...defaultProps}
                    meta={{ touched: false }}
                />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { container } = render(
                <RadioButtonGroupInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { container, queryByText } = render(
                <RadioButtonGroupInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            expect(container.querySelector('p')).not.toBeNull();
            expect(queryByText('Required field.')).not.toBeNull();
        });

        it('should display the error and help text if helperText is present', () => {
            const { queryByText } = render(
                <RadioButtonGroupInput
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
