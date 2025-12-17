import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
    Basic,
    FewColumns,
    LabelTypes,
    NoSource,
} from './ColumnsButton.stories';

describe('ColumnsButton', () => {
    it('should render one row per column unless they are hidden', async () => {
        render(<Basic />);
        fireEvent.click(await screen.findByText('ra.action.select_columns'));
        await screen.findByLabelText('c_0');
        await screen.findByLabelText('c_1');
        await screen.findByLabelText('c_2');
        await screen.findByLabelText('c_3');
        await screen.findByLabelText('c_4');
        await screen.findByLabelText('c_5');
        // await screen.findByLabelText('c_6'); // hidden
        await screen.findByLabelText('c_7');
    });
    it('should not render the filter input when there are too few columns', async () => {
        render(<FewColumns />);
        fireEvent.click(await screen.findByText('ra.action.select_columns'));
        await screen.findByLabelText('c_0');
        expect(screen.queryByText('ra.action.search_columns')).toBeNull();
    });
    it('should render a filter input when there are many columns', async () => {
        render(<LabelTypes />);
        fireEvent.click(await screen.findByText('ra.action.select_columns'));
        await screen.findByLabelText('resources.test.fields.col0');
        expect(
            screen
                .getByRole('menu')
                .querySelectorAll('li:not(.columns-selector-actions)')
        ).toHaveLength(8); // 7 columns + the filter input li
        // Typing a filter
        fireEvent.change(
            screen.getByPlaceholderText('ra.action.search_columns'),
            {
                // filter should be case and diacritics insensitive
                target: { value: 'DiA' },
            }
        );
        await waitFor(() => {
            expect(
                screen
                    .getByRole('menu')
                    .querySelectorAll('li:not(.columns-selector-actions)')
            ).toHaveLength(2); // only the column with 'DiA' in its label should remain + the filter input li
        });
        screen.getByLabelText('Téstïng diàcritics');
        // Clear the filter
        fireEvent.click(screen.getByLabelText('ra.action.clear_input_value'));
        await waitFor(() => {
            expect(
                screen
                    .getByRole('menu')
                    .querySelectorAll('li:not(.columns-selector-actions)')
            ).toHaveLength(8);
        });
    });
    it('should work with columns that have no source', async () => {
        render(<NoSource />);
        await screen.findByText('c0 value');
        fireEvent.click(await screen.findByText('ra.action.select_columns'));
        fireEvent.click(await screen.findByLabelText('c_0'));
        expect(screen.queryByText('c0 value')).toBeNull();
    });
});
