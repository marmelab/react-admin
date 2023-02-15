import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import {
    RecordRepresentation,
    Basic,
    EmptyWithTranslate,
    QueryOptions,
} from './ReferenceOneField.stories';

describe('ReferenceOneField', () => {
    it('should render the recordRepresentation of the related record', async () => {
        render(<RecordRepresentation />);
        await screen.findByText('Genre: novel, ISBN: 9780393966473');
    });
    it('should render its child in the context of the related record', async () => {
        render(<Basic />);
        await screen.findByText('9780393966473');
    });

    it('should translate emptyText', async () => {
        render(<EmptyWithTranslate />);

        await screen.findByText('Not found');
    });
    it('should accept a queryOptions prop', async () => {
        const dataProvider = {
            getManyReference: jest.fn().mockImplementationOnce(() =>
                Promise.resolve({
                    data: [{ id: 1, ISBN: '9780393966473', genre: 'novel' }],
                    total: 1,
                })
            ),
        };
        render(<QueryOptions dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getManyReference).toHaveBeenCalledWith(
                'book_details',
                {
                    id: 1,
                    target: 'book_id',
                    sort: { field: 'id', order: 'ASC' },
                    pagination: { page: 1, perPage: 1 },
                    filter: {},
                    meta: { foo: 'bar' },
                }
            );
        });
    });
});
