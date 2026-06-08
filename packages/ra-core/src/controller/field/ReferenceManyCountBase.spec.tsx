import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Basic,
    ErrorState,
    LoadingState,
    Offline,
    Wrapper,
} from './ReferenceManyCountBase.stories';
import { onlineManager } from '@tanstack/react-query';
import { useRecordContext } from '../record';
import { ReferenceManyCountBase } from './ReferenceManyCountBase';

const CountField = () => {
    const record = useRecordContext<{ total?: number }>();
    return <span>Total: {record?.total}</span>;
};

const ReferenceManyCountBaseAny = ReferenceManyCountBase as any;

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

    it('should render children with the total record context', async () => {
        render(
            <Wrapper
                dataProvider={{
                    getManyReference: () =>
                        Promise.resolve({
                            data: [{ id: 1, post_id: 1 }],
                            total: 3,
                        }),
                }}
            >
                <ReferenceManyCountBaseAny
                    reference="comments"
                    target="post_id"
                >
                    <CountField />
                </ReferenceManyCountBaseAny>
            </Wrapper>
        );

        await screen.findByText('Total: 3');
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
