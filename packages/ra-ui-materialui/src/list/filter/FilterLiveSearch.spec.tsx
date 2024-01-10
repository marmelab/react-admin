import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Basic, HiddenLabel } from './FilterLiveSearch.stories';

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
