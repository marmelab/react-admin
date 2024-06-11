import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';
import { MutationMode } from './BulkUpdateButton.stories';

describe('BulkUpdateButton', () => {
    describe('mutationMode', () => {
        it('should ask confirmation before updating in pessimistic mode', async () => {
            render(<MutationMode />);
            await screen.findByText('War and Peace');
            const checkbox = await screen.findByLabelText('Select all');
            checkbox.click();
            await screen.getByText('10 items selected');
            const button = screen.getByLabelText('Update Pessimistic');
            button.click();
            await screen.findByText(
                'Are you sure you want to update these 10 items?'
            );
            const confirmButton = await screen.findByText('Confirm');
            confirmButton.click();
            await screen.findByText('10 elements updated');
            expect(
                screen.queryByText(
                    'Are you sure you want to update these 10 items?'
                )
            ).toBeNull();
        });
    });
});
