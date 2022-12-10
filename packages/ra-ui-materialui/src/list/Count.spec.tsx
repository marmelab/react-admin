import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Basic, ErrorState, WithFilter } from './Count.stories';

describe('<Count />', () => {
    it('should return the number of records of a given resource', async () => {
        render(<Basic />);
        await screen.findByText('5');
    });
    it('should render an error icon when the request fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<ErrorState />);
        await screen.findByTitle('error');
    });
    it('should accept a filter prop', async () => {
        render(<WithFilter />);
        await screen.findByText('3');
    });
});
