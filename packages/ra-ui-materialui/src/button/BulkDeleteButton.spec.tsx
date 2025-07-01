import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';

import { Themed } from './BulkDeleteButton.stories';

describe('<BulkDeleteButton />', () => {
    it('should be customized by a theme', async () => {
        render(<Themed />);

        const button = await screen.findByTestId('themed');
        expect(button.textContent).toBe('Bulk Delete');
        expect(button.classList).toContain('custom-class');
    });
});
