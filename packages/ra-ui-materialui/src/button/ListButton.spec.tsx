import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import expect from 'expect';
import { Basic, AccessControl, Label, Themed } from './ListButton.stories';

const invalidButtonDomProps = {
    redirect: 'list',
    resource: 'books',
};

describe('<ListButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<Basic buttonProps={invalidButtonDomProps} />);

        expect(spy).not.toHaveBeenCalled();
        expect(screen.getByLabelText('List').tagName).toEqual('A');
        expect(screen.getByLabelText('List').getAttribute('href')).toEqual(
            '/books'
        );

        spy.mockRestore();
    });

    it('should provide a default label', async () => {
        render(<Label translations="default" />);
        await screen.findByText('List');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Liste');
    });

    it('should allow resource specific default title', async () => {
        render(<Label translations="resource specific" />);
        await screen.findByText('See all books');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Voir tous les livres');
    });

    it('should only render when users have the right to list', async () => {
        render(<AccessControl />);
        await screen.findByDisplayValue('War and Peace');
        expect(screen.queryByLabelText('List')).toBeNull();
        fireEvent.click(screen.getByLabelText('Allow accessing books'));
        await screen.findByLabelText('List');
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        const button = screen.queryByTestId('themed-button');
        expect(button.classList).toContain('custom-class');
        expect(button.textContent).toBe('List');
    });
});
