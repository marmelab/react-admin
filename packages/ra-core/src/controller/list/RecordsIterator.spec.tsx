import React from 'react';
import { render, screen } from '@testing-library/react';
import { UsingChildren, UsingRender } from './RecordsIterator.stories';

describe('<RecordsIterator>', () => {
    describe.each([
        { Story: UsingRender, prop: 'render' },
        { Story: UsingChildren, prop: 'children' },
    ])('Using the $prop prop', ({ Story }) => {
        it('should render the records', async () => {
            render(<Story />);

            await screen.findByText('War and Peace');
            await screen.findByText('The Lion, the Witch and the Wardrobe');
        });
        it('should render the pending prop when ListContext.isPending is true', async () => {
            render(<Story isPending />);

            await screen.findByText('Loading...');
        });
        it('should render the empty prop when there is no data', async () => {
            render(<Story empty />);

            await screen.findByText('No data');
        });
    });
});
