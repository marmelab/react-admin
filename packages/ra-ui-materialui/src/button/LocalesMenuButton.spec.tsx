import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Basic } from './LocalesMenuButton.stories';

describe('LocalesMenuButton', () => {
    test('should allow to change language', async () => {
        render(<Basic />);

        expect(screen.queryByText('Dashboard')).not.toBeNull();
        fireEvent.click(screen.getAllByText('English')[0]);

        expect(screen.queryAllByText('English').length).toEqual(2);
        expect(screen.queryByText('Français')).not.toBeNull();

        fireEvent.click(screen.getByText('Français'));
        await waitFor(() => {
            expect(screen.queryByText('Tableau de bord')).not.toBeNull();
        });
    });
});
