import * as React from 'react';
import { render, screen } from '@testing-library/react';
import expect from 'expect';

import { Inspector } from './Inspector.stories';

describe('Inspector', () => {
    it('should not render by default', () => {
        render(<Inspector />);
        expect(
            screen.queryByText('ra.configurable.inspector.content')
        ).toBeNull();
    });
    it('should render when edit mode is turned on', () => {
        render(<Inspector />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getByText('ra.configurable.inspector.content');
    });
    it('should disappear when edit mode is turned off', () => {
        render(<Inspector />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getByLabelText('ra.configurable.configureMode').click();
        expect(
            screen.queryByText('ra.configurable.inspector.content')
        ).toBeNull();
    });
    it('should disappear when clioed by the user', () => {
        render(<Inspector />);
        screen.getByLabelText('ra.configurable.configureMode').click();
        screen.getByLabelText('ra.action.close').click();
        expect(
            screen.queryByText('ra.configurable.inspector.content')
        ).toBeNull();
    });
});
