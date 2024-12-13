import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Basic, Label, Limit } from './SelectAllButton.stories';

describe('<SelectAllButton />', () => {
    it('should render a "Select All" button', async () => {
        render(<Basic />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        await screen.findByRole('button', { name: 'Select all' });
    });
    it('should select all items', async () => {
        render(<Basic />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        await screen.findByText('1 item selected');
        fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
        await screen.findByText('11 items selected');
    });
    it('should render a button with a custom label', async () => {
        render(<Label />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        await screen.findByText('1 item selected');
        await screen.findByRole('button', { name: 'Select all books' });
    });
    it('should not select more records than the limit', async () => {
        render(<Limit />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        await screen.findByText('1 item selected');
        fireEvent.click(
            screen.getByRole('button', { name: 'Select 5 first books' })
        );
        await screen.findByText(
            'There are too many elements to select them all. Only the first 5 elements were selected.'
        );
        await screen.findByText('5 items selected');
    });
    it('should not render if we select more items than the limit', async () => {
        render(<Limit />);
        await screen.findByText('War and Peace');
        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        await screen.findByText('10 items selected');
        expect(
            screen.queryByRole('button', { name: 'Select 5 first books' })
        ).toBeNull();
    });
});
