import * as React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Basic, Unmount } from './Configurable.stories';

describe('Configurable', () => {
    it('should show the block inspector on selection', async () => {
        render(<Basic />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        await screen.findByText('ra.configurable.inspector.title');
        screen.getAllByTitle('ra.configurable.customize')[0].click();
        await screen.findByText('ra.inspector.textBlock');
    });

    it('should show the default value for the settings', async () => {
        render(<Basic />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        await screen.findByText('ra.configurable.inspector.title');
        await screen.getAllByTitle('ra.configurable.customize')[0].click();
        expect(
            (screen.getByLabelText('Background color') as HTMLInputElement)
                .value
        ).toBe('#ffffff');
    });

    it('should allow to change settings', async () => {
        render(<Basic />);
        screen.getByText('Today');
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getAllByTitle('ra.configurable.customize')[1].click();
        await screen.findByText('ra.inspector.salesBlock');
        screen.getByLabelText('Show date').click();
        expect(screen.queryByText('Today')).toBeNull();
    });

    it('should keep settings after the inspector is closed', async () => {
        render(<Basic />);
        screen.getByText('Today');
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getAllByTitle('ra.configurable.customize')[1].click();
        await screen.findByText('ra.inspector.salesBlock');
        screen.getByLabelText('Show date').click();
        screen.getByLabelText('ra.action.close').click();
        expect(screen.queryByText('Today')).toBeNull();
    });

    it('should remove the editor when unmounting', async () => {
        render(<Unmount />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        await screen.findByText('ra.configurable.inspector.title');
        screen.getAllByTitle('ra.configurable.customize')[0].click();
        await screen.findByText('ra.inspector.textBlock');
        screen.getByText('toggle text block').click();
        await waitFor(() => {
            expect(screen.queryByText('Lorem ipsum')).toBeNull();
        });
        expect(screen.queryByText('ra.inspector.textBlock')).toBeNull();
    });

    it('should not remove the editor when unmounting another confiurable element', async () => {
        render(<Unmount />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        await screen.findByText('ra.configurable.inspector.title');
        screen.getAllByTitle('ra.configurable.customize')[0].click();
        await screen.findByText('ra.inspector.textBlock');
        screen.getByText('toggle sales block').click();
        await waitFor(() => {
            expect(screen.queryByText('Today')).toBeNull();
        });
        expect(screen.queryByText('ra.inspector.textBlock')).not.toBeNull();
    });
});
