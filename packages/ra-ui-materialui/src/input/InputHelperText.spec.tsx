import * as React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { InputHelperText } from './InputHelperText';

describe('InputHelperText', () => {
    it('renders the helperText when there is no error', () => {
        const { getByText } = render(
            <InputHelperText helperText="Please help!" />
        );

        expect(getByText('Please help!')).not.toBeNull();
    });

    it('renders the error instead of the helperText when there is an error', () => {
        const { getByText, queryByText } = render(
            <InputHelperText helperText="Please help!" error="Crap!" />
        );

        expect(queryByText('Please help!')).toBeNull();
        expect(getByText('Crap!')).not.toBeNull();
    });

    it('renders an empty string when there is no error and helperText is false', () => {
        const { container } = render(<InputHelperText helperText={false} />);

        expect(container.innerHTML).toBe('');
    });

    it('renders the error when there is an error and helperText is false', () => {
        const { getByText } = render(
            <InputHelperText helperText={false} error="Crap!" />
        );

        expect(getByText('Crap!')).not.toBeNull();
    });
});
