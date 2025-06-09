import { render, screen } from '@testing-library/react';
import expect from 'expect';
import * as React from 'react';
import { Themed } from './UpdateButton.stories';

describe('UpdateButton', () => {
    it('should be customized by a theme', async () => {
        render(<Themed />);
        expect(screen.queryByTestId('themed-button').classList).toContain(
            'custom-class'
        );
    });
});
