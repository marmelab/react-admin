import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Basic, ErrorCase, ResetIdentity } from './useGetIdentity.stories';

describe('useGetIdentity', () => {
    it('should return the identity', async () => {
        render(<Basic />);
        await screen.findByText('John Doe');
    });
    it('should return the authProvider error', async () => {
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});
        render(<ErrorCase />);
        await screen.findByText('Error');
    });
    it('should allow to invalidate the query cache', async () => {
        render(<ResetIdentity />);
        expect(await screen.findByText('John Doe')).not.toBeNull();
        const input = screen.getByDisplayValue('John Doe');
        fireEvent.change(input, { target: { value: 'Jane Doe' } });
        fireEvent.click(screen.getByText('Save'));
        await screen.findByText('Jane Doe');
        expect(screen.queryByText('John Doe')).toBeNull();
    });
});
