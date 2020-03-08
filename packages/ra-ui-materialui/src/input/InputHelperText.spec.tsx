import React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';
import InputHelperText from './InputHelperText';

describe('InputHelperText', () => {
    afterEach(cleanup);

    it('does render empty string when the input has not been touched yet and has no helper text', () => {
        const { container } = render(
            <InputHelperText touched={false} error="Crap!" />
        );
        expect(container.innerHTML).toBe('<span>​</span>');
    });

    it('renders the helperText when there is no error', () => {
        const { getByText } = render(
            <InputHelperText helperText="Please help!" touched />
        );

        expect(getByText('Please help!')).toBeDefined();
    });

    it('renders the helperText when there is an error but the input has not been touched yet', () => {
        const { getByText, queryByText } = render(
            <InputHelperText
                helperText="Please help!"
                touched={false}
                error="Crap!"
            />
        );

        expect(getByText('Please help!')).toBeDefined();
        expect(queryByText('Crap!')).toBeNull();
    });

    it('renders the error instead of the helperText when there is an error and the input was touched', () => {
        const { getByText, queryByText } = render(
            <InputHelperText helperText="Please help!" touched error="Crap!" />
        );

        expect(queryByText('Please help!')).toBeNull();
        expect(getByText('Crap!')).toBeDefined();
    });
});
