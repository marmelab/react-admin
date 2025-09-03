import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Basic } from './IsOffline.stories';
import { onlineManager } from '@tanstack/react-query';

describe('<IsOffline>', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should render children when offline', async () => {
        const { rerender } = render(<Basic isOnline={false} />);
        await screen.findByText('You are offline, the data may be outdated');
        rerender(<Basic isOnline={true} />);
        expect(
            screen.queryByText('You are offline, the data may be outdated')
        ).toBeNull();
    });
});
