import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import {
    NotificationDefault,
    NotificationTranslated,
    FullApp,
} from './DeleteButton.stories';

describe('<DeleteButton />', () => {
    it('should only render when users have the right to delete', async () => {
        render(<FullApp />);
        await screen.findByText('War and Peace');
        expect(screen.queryAllByLabelText('Delete')).toHaveLength(0);
        fireEvent.click(screen.getByLabelText('Allow deleting books'));
        await waitFor(() => {
            // 9 because War and Peace is handled separately
            expect(screen.queryAllByLabelText('Delete')).toHaveLength(9);
        });
    });

    it('should only render when users have the right to delete the specific record', async () => {
        render(<FullApp />);
        await screen.findByText('War and Peace');
        expect(screen.queryByLabelText('Delete')).toBeNull();
        fireEvent.click(screen.getByLabelText('Allow deleting War and Peace'));
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Delete')).toHaveLength(1);
        });
    });
    describe('success notification', () => {
        it('should use a generic success message by default', async () => {
            render(<NotificationDefault />);
            (await screen.findByText('Delete')).click();
            await screen.findByText('Element deleted');
        });

        it('should allow to use a custom translation per resource', async () => {
            render(<NotificationTranslated />);
            (await screen.findByText('Delete')).click();
            await screen.findByText('Book deleted');
        });
    });
});
