import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import expect from 'expect';
import { Basic, AccessControl } from './ListButton.stories';

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

    it('should only render when users have the right to create', async () => {
        render(<AccessControl />);
        await screen.findByDisplayValue('War and Peace');
        expect(screen.queryByLabelText('List')).toBeNull();
        fireEvent.click(screen.getByLabelText('Allow accessing books'));
        await screen.findByLabelText('List');
    });
});
