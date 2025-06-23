import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import expect from 'expect';
import { Basic, AccessControl, Label } from './CreateButton.stories';

const invalidButtonDomProps = {
    redirect: 'list',
    resource: 'books',
};

describe('<CreateButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<Basic buttonProps={invalidButtonDomProps} />);

        expect(spy).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Create').tagName).toEqual('A');
        expect(screen.getByLabelText('Create').getAttribute('href')).toEqual(
            '/books/create'
        );

        spy.mockRestore();
    });

    it('should only render when users have the right to create', async () => {
        render(<AccessControl />);
        await screen.findByText('War and Peace');
        expect(screen.queryByLabelText('Create')).toBeNull();
        fireEvent.click(screen.getByLabelText('Allow creating books'));
        await screen.findByLabelText('Create');
    });

    it('should provide a default label', async () => {
        render(<Label translations="default" />);
        await screen.findByText('Create');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Créer');
    });

    it('should allow resource specific default title', async () => {
        render(<Label translations="resource specific" />);
        await screen.findByText('New book');
        fireEvent.click(screen.getByText('English', { selector: 'button' }));
        fireEvent.click(await screen.findByText('Français'));
        await screen.findByText('Nouveau livre');
    });
});
