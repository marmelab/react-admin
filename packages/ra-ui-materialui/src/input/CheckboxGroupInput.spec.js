import React from 'react';
import expect from 'expect';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { render, cleanup } from 'react-testing-library';

describe('<CheckboxGroupInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        choices: [{ id: 1, name: 'John doe' }],
        input: {
            onChange: () => {},
            value: [],
        },
        translate: x => x,
    };

    afterEach(cleanup);

    it('should render choices as checkbox components', () => {
        const { getByLabelText } = render(
            <CheckboxGroupInput
                {...defaultProps}
                choices={[{ id: 'ang', name: 'Angular' }, { id: 'rct', name: 'React' }]}
            />
        );
        const input1 = getByLabelText('Angular');
        expect(input1.type).toBe('checkbox');
        expect(input1.value).toBe('ang');
        expect(input1.checked).toBe(false);
        const input2 = getByLabelText('React');
        expect(input2.type).toBe('checkbox');
        expect(input2.value).toBe('rct');
        expect(input2.checked).toBe(false);
    });

    it('should use the input parameter value as the initial input value', () => {
        const { getByLabelText } = render(
            <CheckboxGroupInput
                {...defaultProps}
                choices={[{ id: 'ang', name: 'Angular' }, { id: 'rct', name: 'React' }]}
                input={{ value: ['ang'], onChange: () => {} }}
            />
        );
        const input1 = getByLabelText('Angular');
        expect(input1.checked).toBe(true);
        const input2 = getByLabelText('React');
        expect(input2.checked).toBe(false);
    });

    it('should use optionValue as value identifier', () => {
        const { getByLabelText } = render(
            <CheckboxGroupInput {...defaultProps} optionValue="foobar" choices={[{ foobar: 'foo', name: 'Bar' }]} />
        );
        expect(getByLabelText('Bar').value).toBe('foo');
    });

    it('should use optionValue including "." as value identifier', () => {
        const { getByLabelText } = render(
            <CheckboxGroupInput
                {...defaultProps}
                optionValue="foobar.id"
                choices={[{ foobar: { id: 'foo' }, name: 'Bar' }]}
            />
        );
        expect(getByLabelText('Bar').value).toBe('foo');
    });

    it('should use optionText with a string value as text identifier', () => {
        const { queryByLabelText } = render(
            <CheckboxGroupInput {...defaultProps} optionText="foobar" choices={[{ id: 'foo', foobar: 'Bar' }]} />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { queryByLabelText } = render(
            <CheckboxGroupInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[{ id: 'foo', foobar: { name: 'Bar' } }]}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { queryByLabelText } = render(
            <CheckboxGroupInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[{ id: 'foo', foobar: 'Bar' }]}
            />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
    });

    it('should use optionText with an element value as text identifier', () => {
        const Foobar = ({ record }) => <span data-testid="label">{record.foobar}</span>;
        const { queryByLabelText, queryByTestId } = render(
            <CheckboxGroupInput {...defaultProps} optionText={<Foobar />} choices={[{ id: 'foo', foobar: 'Bar' }]} />
        );
        expect(queryByLabelText('Bar')).not.toBeNull();
        expect(queryByTestId('label')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { queryByLabelText } = render(<CheckboxGroupInput {...defaultProps} translate={x => `**${x}**`} />);
        expect(queryByLabelText('**John doe**')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { queryByLabelText } = render(
            <CheckboxGroupInput {...defaultProps} translate={x => `**${x}**`} translateChoice={false} />
        );
        expect(queryByLabelText('**John doe**')).toBeNull();
        expect(queryByLabelText('John doe')).not.toBeNull();
    });

    it('should displayed helperText if prop is present in meta', () => {
        const { queryByText } = render(
            <CheckboxGroupInput {...defaultProps} meta={{ helperText: 'Can I help you?' }} />
        );
        expect(queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { container } = render(
                <CheckboxGroupInput {...defaultProps} meta={{ touched: false, error: 'Required field.' }} />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { container } = render(
                <CheckboxGroupInput {...defaultProps} meta={{ touched: true, error: false }} />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { container, queryByText } = render(
                <CheckboxGroupInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />
            );
            expect(container.querySelector('p')).not.toBeNull();
            expect(queryByText('Required field.')).not.toBeNull();
        });

        it('should display the error and help text if helperText is present', () => {
            const { queryByText } = render(
                <CheckboxGroupInput
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
