import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import {
    Basic,
    HiddenLabel,
    WithFilterButton,
    FullApp,
} from './FilterLiveSearch.stories';

describe('FilterLiveSearch', () => {
    it('renders an empty text input', () => {
        render(<Basic />);
        expect(
            screen.getByLabelText('ra.action.search').getAttribute('type')
        ).toBe('text');
        expect(
            screen.getByLabelText('ra.action.search').getAttribute('value')
        ).toBe('');
    });
    it('filters the list when typing', async () => {
        render(<Basic />);
        expect(screen.queryAllByRole('listitem')).toHaveLength(27);
        fireEvent.change(screen.getByLabelText('ra.action.search'), {
            target: { value: 'st' },
        });
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem')).toHaveLength(2); // Austria and Estonia
        });
    });
    it('clears the filter when user click on the reset button', async () => {
        render(<Basic />);
        fireEvent.change(screen.getByLabelText('ra.action.search'), {
            target: { value: 'st' },
        });
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem')).toHaveLength(2);
        });
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem')).toHaveLength(27);
        });
    });
    it('clears the filter when user click on the Remove all filters button', async () => {
        render(<WithFilterButton />);
        const filterLiveSearchInput = screen.getByLabelText('ra.action.search');
        fireEvent.change(filterLiveSearchInput, {
            target: { value: 'st' },
        });
        expect(filterLiveSearchInput.getAttribute('value')).toBe('st');
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem')).toHaveLength(2);
        });
        fireEvent.click(screen.getByLabelText('ra.action.add_filter'));
        fireEvent.click(await screen.findByText('Remove all filters'));
        await waitFor(() => {
            expect(screen.queryAllByRole('listitem')).toHaveLength(27);
        });
        expect(filterLiveSearchInput.getAttribute('value')).toBe('');
    });
    it('updates its value when filter values change', async () => {
        render(<WithFilterButton />);
        const filterLiveSearchInput = screen.getByLabelText('ra.action.search');
        const textInput = screen.getByLabelText('Q');
        fireEvent.change(textInput, {
            target: { value: 'st' },
        });
        expect(textInput.getAttribute('value')).toBe('st');
        await waitFor(() => {
            expect(filterLiveSearchInput.getAttribute('value')).toBe('st');
        });
        expect(screen.queryAllByRole('listitem')).toHaveLength(2);
    });
    it('should not reapply old value after changing the route and clearing the input', async () => {
        render(<FullApp />);
        let input = (await screen.findByLabelText(
            'Search'
        )) as HTMLInputElement;
        expect(input.value).toBe('');
        await screen.findByText('1-10 of 11');
        fireEvent.change(input, { target: { value: 'st' } });
        await screen.findByText('1-5 of 5');
        fireEvent.click(await screen.findByText('Countries'));
        await screen.findByText('Austria');
        fireEvent.click(await screen.findByText('Books'));
        input = (await screen.findByLabelText('Search')) as HTMLInputElement;
        expect(input.value).toBe('st');
        await screen.findByText('1-5 of 5');
        fireEvent.click(await screen.findByLabelText('Clear value'));
        await screen.findByText('1-10 of 11');
        // Give some time for the residual value to be reapplied (if the bug is present)
        await new Promise(resolve => setTimeout(resolve, 500));
        // Check that the old value is not reapplied
        expect(input.value).toBe('');
    });
    describe('hiddenLabel', () => {
        it('turns the label into a placeholder', () => {
            render(<HiddenLabel />);
            expect(
                screen
                    .getByPlaceholderText('ra.action.search')
                    .getAttribute('type')
            ).toBe('text');
            expect(screen.queryByLabelText('ra.action.search')).toBeNull();
        });
    });
});
