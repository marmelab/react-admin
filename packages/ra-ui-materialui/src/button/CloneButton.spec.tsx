import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TestMemoryRouter } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { CloneButton } from './CloneButton';
import { Basic, Themed } from './CloneButton.stories';

const invalidButtonDomProps = {
    record: { id: 123, foo: 'bar' },
    resource: 'posts',
};

describe('<CloneButton />', () => {
    it('should pass a clone of the record in the location search', () => {
        render(<Basic />);

        expect(
            screen.getByLabelText('ra.action.clone').getAttribute('href')
        ).toEqual('#/posts/create?source=%7B%22foo%22%3A%22bar%22%7D');
    });

    it('should pass a clone of the record in the location state', async () => {
        let location;
        render(
            <TestMemoryRouter
                locationCallback={l => {
                    location = l;
                }}
            >
                <Basic />
            </TestMemoryRouter>
        );
        fireEvent.click(screen.getByLabelText('ra.action.clone'));
        await waitFor(() => {
            expect(location.pathname).toEqual('/posts/create');
        });
        expect(location.state.record).toEqual({ foo: 'bar' });
    });

    it('should render as button type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <AdminContext>
                <CloneButton {...invalidButtonDomProps} />
            </AdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(
            screen.getByLabelText('ra.action.clone').getAttribute('href')
        ).toEqual('#/posts/create?source=%7B%22foo%22%3A%22bar%22%7D');

        spy.mockRestore();
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);

        const button = await screen.findByTestId('themed');
        expect(button.textContent).toBe('Clone');
        expect(button.classList).toContain('custom-class');
    });
});
