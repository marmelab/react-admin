import * as React from 'react';
import { render, screen } from '@testing-library/react';
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
    it('should render when edit mode is turned on', () => {
        render(<Inspector />);
        screen.getByLabelText('Configure mode').click();
        screen.getByText('Hover the application UI elements to configure them');
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
    it('should disappear when closed by the user', () => {
        render(<Inspector />);
        screen.getByLabelText('Configure mode').click();
        screen.getByLabelText('ra.action.close').click();
        expect(
            screen.queryByText(
                'Hover the application UI elements to configure them'
            )
        ).toBeNull();
    });
});
