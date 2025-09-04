import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import {
    Basic,
    ErrorState,
    Offline,
    Themed,
    WithFilter,
    Wrapper,
} from './ReferenceManyCount.stories';
import { ReferenceManyCount } from './ReferenceManyCount';
import { onlineManager } from '@tanstack/react-query';

describe('<ReferenceManyCount />', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should return the number of related records of a given reference', async () => {
        render(<Basic />);
        await screen.findByText('3');
    });
    it('should render an error icon when the request fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<ErrorState />);
        await screen.findByTitle('error');
    });
    it('should accept a filter prop', async () => {
        render(<WithFilter />);
        await screen.findByText('2');
    });
    it('should accept a sort prop', async () => {
        const dataProvider = {
            getManyReference: jest.fn(),
        } as any;
        render(
            <Wrapper dataProvider={dataProvider}>
                <ReferenceManyCount
                    reference="comments"
                    target="post_id"
                    sort={{ field: 'custom_id', order: 'ASC' }}
                />
            </Wrapper>
        );
        expect(dataProvider.getManyReference).toHaveBeenCalledWith('comments', {
            target: 'post_id',
            id: 1,
            filter: {},
            pagination: { page: 1, perPage: 1 },
            sort: { field: 'custom_id', order: 'ASC' },
            meta: undefined,
            signal: undefined,
        });
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        expect(screen.getByTestId('themed')).toBeDefined();
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('No connectivity. Could not fetch data.');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('3');
        fireEvent.click(await screen.findByText('Simulate offline'));
        expect(
            screen.queryByText('No connectivity. Could not fetch data.')
        ).toBeNull();
        await screen.findByText('3');
        fireEvent.click(await screen.findByText('Simulate online'));
    });
});
