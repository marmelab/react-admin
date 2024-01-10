import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';

import { Basic } from './ToggleThemeButton.stories';

describe('ToggleThemeButton', () => {
    it('should display a button', () => {
        render(<Basic />);
        screen.getByLabelText('Toggle light/dark mode');
    });
    it('should allow to change the theme between light and dark', () => {
        const { container } = render(<Basic />);
        const root = container.querySelector<HTMLDivElement>(
            '.MuiScopedCssBaseline-root'
        );
        if (!root) {
            throw new Error('No root element found');
        }
        expect(getComputedStyle(root).colorScheme).toBe('light');
        screen.getByLabelText('Toggle light/dark mode').click();
        expect(getComputedStyle(root).colorScheme).toBe('dark');
        screen.getByLabelText('Toggle light/dark mode').click();
        expect(getComputedStyle(root).colorScheme).toBe('light');
    });
});
