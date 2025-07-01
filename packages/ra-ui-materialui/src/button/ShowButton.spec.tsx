import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { Basic, AccessControl, Label, Themed } from './ShowButton.stories';

const invalidButtonDomProps = {
    redirect: 'list',
    resource: 'books',
};

describe('<ShowButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<Basic buttonProps={invalidButtonDomProps} />);

        expect(spy).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Show').tagName).toEqual('A');
        expect(screen.getByLabelText('Show').getAttribute('href')).toEqual(
            '/books/1/show'
        );

        spy.mockRestore();
    });

    it('should provide a default label', async () => {
        render(<Label translations="default" />);
        await screen.findByText('Show');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Afficher');
    });

    it('should allow resource specific default title', async () => {
        render(<Label translations="resource specific" />);
        await screen.findByText('See War and Peace');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Voir War and Peace');
    });

    it('should only render when users have the right to show', async () => {
        render(<AccessControl />);
        await screen.findByText('War and Peace');
        expect(screen.queryAllByLabelText('Show')).toHaveLength(0);
        fireEvent.click(screen.getByLabelText('Allow accessing books'));
        await waitFor(() => {
            // 9 because War and Peace is handled separately
            expect(screen.queryAllByLabelText('Show')).toHaveLength(9);
        });
    });

    it('should only render when users have the right to show the specific record', async () => {
        render(<AccessControl />);
        await screen.findByText('War and Peace');
        expect(screen.queryByLabelText('Show')).toBeNull();
        fireEvent.click(screen.getByLabelText('Allow accessing War and Peace'));
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Show')).toHaveLength(1);
        });
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        const button = screen.queryByTestId('themed-button');
        expect(button.classList).toContain('custom-class');
        expect(button.textContent).toBe('Show');
    });
});
