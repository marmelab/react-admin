import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Basic } from './PrevNextButton.stories';

describe('<PrevNextButton />', () => {
    it('should render next prev button at position 4 with a total of 905', async () => {
        render(<Basic />);
        const tr = await screen.findByText('Deja');
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        expect(screen.getByText('4 / 904')).toBeDefined();
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
        const lastPage = await screen.findByText('91');
        fireEvent.click(lastPage);
        const tr = await screen.findByText('Clara');
        screen.debug(tr);
        fireEvent.click(tr);
        await screen.findByRole('navigation');
        const nextButton = screen.getByLabelText('Go to next page');
        expect(nextButton).toBeDefined();
        expect(nextButton).toHaveProperty('disabled', true);
    });
});
