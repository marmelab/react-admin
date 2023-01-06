import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Basic, ErrorState, WithFilter } from './ReferenceManyCount.stories';

describe('<ReferenceManyCount />', () => {
    it('should return the number of related records of a given reference', async () => {
        render(<Basic />);
        await screen.findByText('3');
    });
    it('should render an error icon when the request fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<ErrorState />);
        await screen.findByTitle('error');
    });
    it('should accept a filter prop', async () => {
        render(<WithFilter />);
        await screen.findByText('2');
    });
});
