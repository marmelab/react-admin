import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Themed } from './PasswordInput.stories';

describe('<PasswordInput />', () => {
    it('should be customized by a theme', async () => {
        render(<Themed />);
        await screen.findByTestId('themed');
    });
});
