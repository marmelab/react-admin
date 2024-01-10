import * as React from 'react';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import { Basic, FullApp } from './LocalesMenuButton.stories';

describe('LocalesMenuButton', () => {
    it('should allow to change language', async () => {
        render(<Basic />);

        expect(screen.queryByText('Dashboard')).not.toBeNull();
        fireEvent.click(screen.getAllByText('English')[0]);

        expect(screen.queryAllByText('English').length).toEqual(2);
        expect(screen.queryByText('Français')).not.toBeNull();

        fireEvent.click(screen.getByText('Français'));
        await waitFor(() => {
            expect(screen.queryByText('Tableau de bord')).not.toBeNull();
        });

        fireEvent.click(screen.getAllByText('Français')[0]);
        fireEvent.click(screen.getByText('English'));
        await waitFor(() => {
            expect(screen.queryByText('Dashboard')).not.toBeNull();
        });
    });

    it('should not make the title disappear', async () => {
        const { container } = render(<FullApp />);

        await screen.findByText('War and Peace');
        let title = container.querySelector(
            '#react-admin-title'
        ) as HTMLElement;
        expect(within(title).queryByText('Books')).not.toBeNull();

        fireEvent.click(screen.getAllByText('English')[0]);
        expect(screen.queryAllByText('English').length).toEqual(2);
        expect(screen.queryByText('Français')).not.toBeNull();
        fireEvent.click(screen.getByText('Français'));

        await screen.findAllByText('Livres');
        title = container.querySelector('#react-admin-title') as HTMLElement;
        expect(within(title).queryByText('Livres')).not.toBeNull();
    });
});
