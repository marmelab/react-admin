import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import {
    Basic,
    HiddenLabel,
    WithFilterButton,
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
    it('filters the list when typing', () => {
        render(<Basic />);
        expect(screen.queryAllByRole('listitem')).toHaveLength(27);
        fireEvent.change(screen.getByLabelText('ra.action.search'), {
            target: { value: 'st' },
        });
        expect(screen.queryAllByRole('listitem')).toHaveLength(2); // Austria and Estonia
    });
    it('clears the filter when user click on the reset button', () => {
        render(<Basic />);
        fireEvent.change(screen.getByLabelText('ra.action.search'), {
            target: { value: 'st' },
        });
        expect(screen.queryAllByRole('listitem')).toHaveLength(2);
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        expect(screen.queryAllByRole('listitem')).toHaveLength(27);
    });
    it('clears the filter when user click on the Remove all filters button', async () => {
        render(<WithFilterButton />);
        const filterLiveSearchInput = screen.getByLabelText('ra.action.search');
        fireEvent.change(filterLiveSearchInput, {
            target: { value: 'st' },
        });
        expect(filterLiveSearchInput.getAttribute('value')).toBe('st');
        expect(screen.queryAllByRole('listitem')).toHaveLength(2);
        fireEvent.click(screen.getByLabelText('ra.action.add_filter'));
        fireEvent.click(await screen.findByText('Remove all filters'));
        expect(screen.queryAllByRole('listitem')).toHaveLength(27);
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
