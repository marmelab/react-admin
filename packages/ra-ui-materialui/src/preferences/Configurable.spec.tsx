import * as React from 'react';
import { screen, render } from '@testing-library/react';
import expect from 'expect';

import { Basic } from './Configurable.stories';

describe('Configurable', () => {
    it('should show the block inspector on selection', async () => {
        render(<Basic />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getByText('ra.configurable.inspector.title');
        screen.getAllByLabelText('ra.configurable.customize')[0].click();
        await screen.findByText('ra.inspector.textBlock');
    });

    it('should show the default value for the settings', () => {
        render(<Basic />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getAllByLabelText('ra.configurable.customize')[0].click();
        expect(
            (screen.getByLabelText('Background color') as HTMLInputElement)
                .value
        ).toBe('#ffffff');
    });

    it('should allow to change settings', async () => {
        render(<Basic />);
        screen.getByText('Today');
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getAllByLabelText('ra.configurable.customize')[1].click();
        await screen.findByText('ra.inspector.salesBlock');
        screen.getByLabelText('Show date').click();
        expect(screen.queryByText('Today')).toBeNull();
    });

    it('should keep settings after the inspector is closed', async () => {
        render(<Basic />);
        screen.getByText('Today');
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getAllByLabelText('ra.configurable.customize')[1].click();
        await screen.findByText('ra.inspector.salesBlock');
        screen.getByLabelText('Show date').click();
        screen.getByLabelText('ra.action.close').click();
        expect(screen.queryByText('Today')).toBeNull();
    });
});
