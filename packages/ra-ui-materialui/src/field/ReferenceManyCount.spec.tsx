import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
    Basic,
    ErrorState,
    WithFilter,
    Wrapper,
} from './ReferenceManyCount.stories';
import { ReferenceManyCount } from './ReferenceManyCount';

describe('<ReferenceManyCount />', () => {
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
        });
    });
});
