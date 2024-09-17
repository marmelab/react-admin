import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
    NotificationDefault,
    NotificationTranslated,
} from './DeleteButton.stories';

describe('DeleteButton', () => {
    describe('success notification', () => {
        it('should use a generic success message by default', async () => {
            render(<NotificationDefault />);
            (await screen.findByText('Delete')).click();
            await screen.findByText('Element deleted');
        });

        it('should allow to use a custom translation per resource', async () => {
            render(<NotificationTranslated />);
            (await screen.findByText('Delete')).click();
            await screen.findByText('Book deleted');
        });
    });
});
