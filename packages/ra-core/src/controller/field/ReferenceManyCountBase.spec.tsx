import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Basic,
    ErrorState,
    LoadingState,
    Offline,
    WithChildren,
    WithRenderFunction,
} from './ReferenceManyCountBase.stories';
import { onlineManager } from '@tanstack/react-query';

describe('ReferenceManyCountBase', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        render(<ErrorState />);
        await screen.findByText('Error!');
    });

    it('should display the loading state', async () => {
        render(<LoadingState />);
        await screen.findByText('loading...', undefined, { timeout: 2000 });
    });

    it('should render the total', async () => {
        render(<Basic />);
        await screen.findByText('3');
    });

    it('should render children in a record context containing the total', async () => {
        render(<WithChildren />);
        await screen.findByText('3 comments');
    });

    it('should accept a render function as children', async () => {
        render(<WithRenderFunction />);
        await screen.findByText('3 comments');
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('You are offline, cannot load data');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('3');
        fireEvent.click(await screen.findByText('Simulate offline'));
        expect(
            screen.queryByText('You are offline, cannot load data')
        ).toBeNull();
        await screen.findByText('3');
        fireEvent.click(await screen.findByText('Simulate online'));
    });
});
