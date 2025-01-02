import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Basic, Label, Limit } from './SelectAllButton.stories';

describe('<SelectAllButton />', () => {
    it('should render a "Select All" button', async () => {
        render(<Basic />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        await screen.findByRole('button', { name: 'Select all' });
    });

    it('should not render a "Select All" button if not all checkboxes are checked', async () => {
        render(<Basic />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        await screen.findByText('10 items selected');
        await screen.findByRole('button', { name: 'Select all' });
        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        await screen.findByText('9 items selected');
        expect(screen.queryByRole('button', { name: 'Select all' })).toBeNull();
    });

    it('should select all items', async () => {
        render(<Basic />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        await screen.findByText('10 items selected');
        fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
        await screen.findByText('17 items selected');
    });

    describe('label', () => {
        it('should allow to customize the label', async () => {
            render(<Label />);
            await screen.findByText('War and Peace');
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            await screen.findByRole('button', { name: 'Select all books' });
        });
    });

    describe('limit', () => {
        it('should not select more records than the limit', async () => {
            render(<Limit />);
            await screen.findByText('War and Peace');
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            fireEvent.click(
                screen.getByRole('button', {
                    name: 'Select all books (max 15)',
                })
            );
            await screen.findByText(
                'There are too many elements to select them all. Only the first 15 elements were selected.'
            );
            await screen.findByText('15 items selected');
        });

        it('should not render if we select more items than the limit', async () => {
            render(<Limit />);
            await screen.findByText('War and Peace');
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('10 items selected');
            fireEvent.click(
                screen.getByRole('button', { name: 'Go to next page' })
            );
            await screen.findByText('Ulysses');
            fireEvent.click(screen.getAllByRole('checkbox')[0]);
            await screen.findByText('17 items selected');
            expect(
                screen.queryByRole('button', {
                    name: 'Select all books (max 15)',
                })
            ).toBeNull();
        });
    });
});
