import React from 'react';
import expect from 'expect';
import { render, fireEvent, cleanup } from 'react-testing-library';

import { DateInput } from './DateInput';

describe('<DateInput />', () => {
    const defaultProps = {
        resource: 'bar',
        source: 'foo',
        meta: {},
        input: {},
        translate: x => x,
    };

    afterEach(cleanup);

    it('should render a date input', () => {
        const { getByLabelText } = render(<DateInput {...defaultProps} />);
        expect(getByLabelText('resources.bar.fields.foo').type).toBe('date');
    });

    it('should call `input.onChange` method when changed', () => {
        const onChange = jest.fn();
        const { getByLabelText } = render(
            <DateInput {...defaultProps} input={{ onChange }} />
        );
        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.change(input, { target: { value: '2010-01-04' } });
        expect(onChange.mock.calls[0][0]).toBe('2010-01-04');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { container } = render(
                <DateInput {...defaultProps} meta={{ touched: false }} />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { container } = render(
                <DateInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            expect(container.querySelector('p')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { container, queryByText } = render(
                <DateInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            expect(container.querySelector('p')).not.toBeNull();
            expect(queryByText('Required field.')).not.toBeNull();
        });
    });
});
