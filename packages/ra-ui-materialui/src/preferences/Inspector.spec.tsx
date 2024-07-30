import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Inspector } from './Inspector.stories';

describe('Inspector', () => {
    it('should not render by default', () => {
        render(<Inspector />);
        expect(
            screen.queryByText(
                'Hover the application UI elements to configure them'
            )
        ).toBeNull();
    });
    it('should render when edit mode is turned on', async () => {
        render(<Inspector />);
        screen.getByLabelText('Configure mode').click();
        await waitFor(() => {
            screen.getByText(
                'Hover the application UI elements to configure them'
            );
        });
    });
    it('should disappear when edit mode is turned off', () => {
        render(<Inspector />);
        screen.getByLabelText('Configure mode').click();
        screen.getByLabelText('Configure mode').click();
        expect(
            screen.queryByText(
                'Hover the application UI elements to configure them'
            )
        ).toBeNull();
    });
    it('should disappear when closed by the user', async () => {
        render(<Inspector />);
        screen.getByLabelText('Configure mode').click();
        (await screen.findByLabelText('ra.action.close')).click();
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Hover the application UI elements to configure them'
                )
            ).toBeNull();
        });
    });
});
