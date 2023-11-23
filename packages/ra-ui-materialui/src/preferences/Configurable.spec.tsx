import * as React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';

import { Basic, Unmount } from './Configurable.stories';

describe('Configurable', () => {
    it('should show the block inspector on selection', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Lorem ipsum'));
        screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Text block');
    });

    it('should show the default value for the settings', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Lorem ipsum'));
        screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Background color');
        expect(
            (screen.getByLabelText('Background color') as HTMLInputElement)
                .value
        ).toBe('#ffffff');
    });

    it('should allow to change settings', async () => {
        render(<Basic />);
        screen.getByText('Today');
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Sales'));
        screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Sales block');
        screen.getByLabelText('Show date').click();
        expect(screen.queryByText('Today')).toBeNull();
    });

    it('should keep settings after the inspector is closed', async () => {
        render(<Basic />);
        screen.getByText('Today');
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');

        fireEvent.mouseOver(screen.getByText('Sales'));
        (
            await screen.findByTitle('ra.configurable.customize', undefined, {
                timeout: 4000,
            })
        ).click();
        await screen.findByText('Sales block');
        screen.getByLabelText('Show date').click();
        screen.getByLabelText('ra.action.close').click();
        expect(screen.queryByText('Today')).toBeNull();
    });

    it('should remove the editor when unmounting', async () => {
        render(<Unmount />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Lorem ipsum'));
        screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Text block');
        screen.getByText('toggle text block').click();
        await waitFor(() => {
            expect(screen.queryByText('Lorem ipsum')).toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('Text block')).toBeNull();
        });
    });

    it('should not remove the editor when unmounting another configurable element', async () => {
        render(<Unmount />);
        screen.getByLabelText('Configure mode').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Lorem ipsum'));
        screen.getByTitle('ra.configurable.customize').click();
        await screen.findByText('Text block');
        screen.getByText('toggle sales block').click();
        await waitFor(() => {
            expect(screen.queryByText('Today')).toBeNull();
        });
        expect(screen.queryByText('Text block')).not.toBeNull();
    });
});
