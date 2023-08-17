import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    ErrorState,
    WithFilter,
    WithLimit,
    WithQueryFilter,
} from './PrevNextButtons.stories';
describe('<PrevNextButtons />', () => {
    beforeEach(() => {
        window.scrollTo = jest.fn();
    });

    it('should render the current record position according to the clicked item in the list', async () => {
        render(<Basic />);
        const tr = await screen.findByText('Deja');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        expect(screen.getByText('4 / 900')).toBeDefined();
    });

    it('should render previous button as disabled if there is no previous record', async () => {
        render(<Basic />);
        const tr = await screen.findByText('Maurine');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        const previousButton = screen.getByLabelText('Go to previous page');
        expect(previousButton).toBeDefined();
        expect(previousButton).toHaveProperty('disabled', true);
    });

    it('should render next button as disabled if there is no next record', async () => {
        render(<Basic />);
        const lastPage = await screen.findByText('90');
        fireEvent.click(lastPage);
        const tr = await screen.findByText('Maxwell');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        const nextButton = screen.getByLabelText('Go to next page');
        expect(nextButton).toBeDefined();
        expect(nextButton).toHaveProperty('disabled', true);
    });

    it('should go on edit view by default', async () => {
        render(<Basic />);
        const row = await screen.findByText('Deja');
        fireEvent.click(row);
        const next = await screen.findByLabelText('Go to next page');
        fireEvent.click(next);
        expect(screen.getByLabelText('First name').getAttribute('type')).toBe(
            'text'
        );
    });

    it('should go on show view by default', async () => {
        render(<Basic />);
        const row = await screen.findByText('Deja');
        fireEvent.click(row);
        fireEvent.click(screen.getByLabelText('Show'));
        const next = await screen.findByLabelText('Go to next page');
        fireEvent.click(next);
        expect(screen.queryByLabelText('First name')).toBeNull();
        expect(screen.getByText('First name')).toBeDefined();
    });

    it('should render a total based on filter', async () => {
        render(<WithFilter />);
        const item = await screen.findByText('822');
        fireEvent.click(item);
        await screen.findByRole('navigation');
        expect(screen.getByText('1 / 5')).toBeDefined();
    });

    it('should render a total based on query filter', async () => {
        render(<WithQueryFilter />);
        const input = await screen.findByLabelText('Search');
        fireEvent.change(input, { target: { value: 'east' } });
        const item = await screen.findByText('217');
        fireEvent.click(item);
        await screen.findByRole('navigation');
        expect(screen.getByText('10 / 57')).toBeDefined();
    });

    it('should render a total based on limit', async () => {
        render(<WithLimit />);
        const item = await screen.findByText('0');
        fireEvent.click(item);
        await screen.findByRole('navigation');
        expect(screen.getByText('1 / 500')).toBeDefined();
    });

    it('should render an error', async () => {
        console.error = jest.fn();
        render(<ErrorState />);
        await screen.findByRole('progressbar');
        expect(screen.getByText('error')).toBeDefined();
    });
});
