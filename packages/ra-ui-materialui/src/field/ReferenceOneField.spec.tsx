import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import {
    RecordRepresentation,
    Basic,
    EmptyTextWithTranslate,
    QueryOptions,
    EmptyText,
    Empty,
    Themed,
    WithRenderProp,
    Offline,
} from './ReferenceOneField.stories';
import { onlineManager } from '@tanstack/react-query';

describe('ReferenceOneField', () => {
    beforeEach(() => {
        onlineManager.setOnline(true);
    });
    it('should render the recordRepresentation of the related record', async () => {
        render(<RecordRepresentation />);
        await screen.findByText('Genre: novel, ISBN: 9780393966473');
    });

    it('should render its child in the context of the related record', async () => {
        render(<Basic />);
        await screen.findByText('9780393966473');
    });

    it('should translate emptyText', async () => {
        render(<EmptyTextWithTranslate />);

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
                    signal: undefined,
                }
            );
        });
    });

    it('should allow to render the referenceRecord using a render prop', async () => {
        render(<WithRenderProp />);
        await screen.findByText('9780393966473');
    });

    describe('emptyText', () => {
        it('should render the emptyText prop when the record is not found', async () => {
            render(<EmptyText />);
            await waitFor(() => {
                expect(screen.queryAllByText('no detail')).toHaveLength(3);
            });
            fireEvent.click(screen.getByText('War and Peace'));
            await screen.findByText('Create');
        });
    });

    describe('empty', () => {
        it('should render the empty prop when the record is not found', async () => {
            render(<Empty />);
            await waitFor(() => {
                expect(screen.queryAllByText('no detail')).toHaveLength(3);
            });
            fireEvent.click(screen.getByText('War and Peace'));
            await screen.findByText('Create');
        });
    });

    it('should be customized by a theme', async () => {
        render(<Themed />);
        expect(await screen.findByTestId('themed')).toBeDefined();
    });

    it('should render the offline prop node when offline', async () => {
        render(<Offline />);
        fireEvent.click(await screen.findByText('Simulate offline'));
        fireEvent.click(await screen.findByText('Toggle Child'));
        await screen.findByText('No connectivity. Could not fetch data.');
        fireEvent.click(await screen.findByText('Simulate online'));
        await screen.findByText('9780393966473');
    });
});
