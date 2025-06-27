import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Default, WithDashboard, WithKeyboardShortcuts } from './Menu.stories';

describe('<Menu>', () => {
    it('should render a default menu with items for all registered resources', async () => {
        render(<Default />);
        await screen.findByText('Posts', { selector: '[role="menuitem"] *' });
        await screen.findByText('Comments', {
            selector: '[role="menuitem"] *',
        });
        await screen.findByText('Tags', { selector: '[role="menuitem"] *' });
        await screen.findByText('Users', { selector: '[role="menuitem"] *' });
        await screen.findByText('Orders', { selector: '[role="menuitem"] *' });
        await screen.findByText('Reviews', { selector: '[role="menuitem"] *' });
    });

    it('should render a default menu with items for all registered resources and the dashboard', async () => {
        render(<WithDashboard />);
        await screen.findByText('Dashboard', {
            selector: '[role="menuitem"] *',
        });
        await screen.findByText('Posts', { selector: '[role="menuitem"] *' });
        await screen.findByText('Comments', {
            selector: '[role="menuitem"] *',
        });
        await screen.findByText('Tags', { selector: '[role="menuitem"] *' });
        await screen.findByText('Users', { selector: '[role="menuitem"] *' });
        await screen.findByText('Orders', { selector: '[role="menuitem"] *' });
        await screen.findByText('Reviews', { selector: '[role="menuitem"] *' });
    });

    it('should support keyboard shortcuts', async () => {
        render(<WithKeyboardShortcuts />);
        await screen.findByText('Dashboard', {
            selector: '[role="menuitem"] *',
        });
        fireEvent.keyDown(global.document, {
            key: 'g',
            code: 'KeyG',
        });
        fireEvent.keyDown(global.document, {
            key: 'c',
            code: 'KeyC',
        });
        // Only one Customers text as the menu item has a different longer label
        await screen.findByText('Customers');
        fireEvent.keyDown(global.document, {
            key: 'g',
            code: 'KeyG',
        });
        fireEvent.keyDown(global.document, {
            key: 's',
            code: 'KeyS',
        });
        expect(await screen.findAllByText('Sales')).toHaveLength(2);
        fireEvent.keyDown(global.document, {
            key: 'g',
            code: 'KeyG',
        });
        fireEvent.keyDown(global.document, {
            key: 'p',
            code: 'KeyP',
        });
        expect(await screen.findAllByText('Products')).toHaveLength(2);
        fireEvent.keyDown(global.document, {
            key: 'g',
            code: 'KeyG',
        });
        fireEvent.keyDown(global.document, {
            key: 'd',
            code: 'KeyD',
        });
        expect(await screen.findAllByText('Dashboard')).toHaveLength(2);
    });
});
