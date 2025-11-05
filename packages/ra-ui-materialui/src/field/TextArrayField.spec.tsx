import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Basic } from './TextArrayField.stories';

describe('<TextArrayField />', () => {
    it('should render the array values', async () => {
        render(<Basic />);
        await screen.findByText('Fiction');
        await screen.findByText('Historical Fiction');
        await screen.findByText('Classic Literature');
        await screen.findByText('Russian Literature');
    });
});
