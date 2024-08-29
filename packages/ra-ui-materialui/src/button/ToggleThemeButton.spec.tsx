import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Basic } from './ToggleThemeButton.stories';

describe('ToggleThemeButton', () => {
    it('should display a button', () => {
        render(<Basic />);
        screen.getByLabelText('Toggle light/dark mode');
    });
    it('should allow to change the theme between light and dark', async () => {
        const { container } = render(<Basic />);
        const root = container.parentElement!.parentElement;
        if (!root) {
            throw new Error('No root element found');
        }
        expect(getComputedStyle(root).colorScheme).toBe('light');
        screen.getByLabelText('Toggle light/dark mode').click();
        await waitFor(() => {
            expect(getComputedStyle(root).colorScheme).toBe('dark');
        });
        screen.getByLabelText('Toggle light/dark mode').click();
        await waitFor(() => {
            expect(getComputedStyle(root).colorScheme).toBe('light');
        });
    });
});
